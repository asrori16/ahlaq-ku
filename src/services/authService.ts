import { UserAccount, UserRole } from '../types';
import { supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  USERS: 'akhlaqku_users_list',
  CURRENT_USER: 'akhlaqku_current_session_user',
};

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'usr_admin_1',
    username: 'admin',
    password: 'admin123',
    fullName: 'Ustadz H. Ahmad Farhan, M.Pd.I',
    role: 'admin',
    email: 'admin.pai@sekolah.sch.id',
    school: 'SMA Negeri 1 Jakarta',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr_std_1',
    username: 'siswa',
    password: 'siswa123',
    fullName: 'Ahmad Fauzi',
    role: 'student',
    nisn: '0078129341',
    classGrade: 'XI MIPA 2',
    school: 'SMA Negeri 1 Jakarta',
    email: 'fauzi.ahmad@siswa.belajar.id',
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'usr_std_2',
    username: 'aisyah',
    password: 'siswa123',
    fullName: 'Siti Aisyah Azzahra',
    role: 'student',
    nisn: '0078129342',
    classGrade: 'XI MIPA 2',
    school: 'SMA Negeri 1 Jakarta',
    email: 'aisyah.azzahra@siswa.belajar.id',
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'usr_std_3',
    username: 'rizky',
    password: 'siswa123',
    fullName: 'Muhammad Rizky Pratama',
    role: 'student',
    nisn: '0078129343',
    classGrade: 'XI IPS 1',
    school: 'SMA Negeri 1 Jakarta',
    email: 'rizky.pratama@siswa.belajar.id',
    createdAt: '2026-02-05T08:00:00Z',
  },
];

export const getStoredUsers = (): UserAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return parsed;
  } catch (e) {
    console.warn('Error loading stored users, using default', e);
    return DEFAULT_USERS;
  }
};

export const saveStoredUsers = (users: UserAccount[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
};

export const getCurrentUser = (): UserAccount | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading current session', e);
  }
  return null;
};

export const setCurrentUser = (user: UserAccount | null) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      // Also update student profile helper
      localStorage.setItem('akhlaqku_student_name', user.fullName);
      if (user.school) {
        localStorage.setItem('akhlaqku_school_name', user.school);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Failed to set current user', e);
  }
};

export const loginUser = async (
  usernameInput: string,
  passwordInput: string,
  preferredRole?: UserRole
): Promise<{ success: boolean; user?: UserAccount; error?: string }> => {
  const cleanUsername = usernameInput.trim().toLowerCase();
  const rawIdentifier = usernameInput.trim();

  // 1. Coba verifikasi lewat Supabase Database RPC (Metode 2: pgcrypto / bcrypt)
  try {
    const { data, error } = await supabase.rpc('verify_user_login', {
      p_identifier: rawIdentifier,
      p_password: passwordInput,
    });

    if (!error && Array.isArray(data) && data.length > 0) {
      const row = data[0];
      const verifiedUser: UserAccount = {
        id: row.id,
        username: row.username,
        fullName: row.full_name,
        role: row.role as UserRole,
        nisn: row.nisn || undefined,
        classGrade: row.class_grade || undefined,
        school: row.school || undefined,
        email: row.email || undefined,
        createdAt: row.created_at || new Date().toISOString(),
      };

      if (preferredRole && verifiedUser.role !== preferredRole) {
        return {
          success: false,
          error: `Akun ini terdaftar sebagai ${verifiedUser.role === 'admin' ? 'Admin' : 'Siswa'}, bukan ${preferredRole === 'admin' ? 'Admin' : 'Siswa'}.`,
        };
      }

      setCurrentUser(verifiedUser);

      // Sinkronkan ke local cache users jika belum ada
      const currentList = getStoredUsers();
      if (!currentList.some((u) => u.id === verifiedUser.id || u.username.toLowerCase() === verifiedUser.username.toLowerCase())) {
        saveStoredUsers([...currentList, verifiedUser]);
      }

      return { success: true, user: verifiedUser };
    } else if (!error && Array.isArray(data) && data.length === 0) {
      // Cek apakah user ada tapi password salah
      const { data: userExists } = await supabase
        .from('users')
        .select('id, role')
        .or(`username.ilike.${cleanUsername},nisn.eq.${rawIdentifier}`)
        .maybeSingle();

      if (userExists) {
        return { success: false, error: 'Kata sandi tidak sesuai' };
      }
    }
  } catch (rpcErr) {
    console.warn('Supabase login RPC note, fallback ke cache lokal:', rpcErr);
  }

  // 2. Fallback offline / local cache jika offline atau RPC belum terpasang
  const users = getStoredUsers();
  const user = users.find(
    (u) =>
      u.username.toLowerCase() === cleanUsername ||
      (u.nisn && u.nisn === rawIdentifier)
  );

  if (!user) {
    return { success: false, error: 'Pengguna / NISN tidak ditemukan' };
  }

  if (preferredRole && user.role !== preferredRole) {
    return {
      success: false,
      error: `Akun ini terdaftar sebagai ${user.role === 'admin' ? 'Admin' : 'Siswa'}, bukan ${preferredRole === 'admin' ? 'Admin' : 'Siswa'}.`,
    };
  }

  if (user.password && user.password !== passwordInput) {
    return { success: false, error: 'Kata sandi tidak sesuai' };
  }

  setCurrentUser(user);
  return { success: true, user };
};

export const logoutUser = () => {
  setCurrentUser(null);
};

export const addUser = (data: {
  fullName: string;
  username: string;
  password?: string;
  role: UserRole;
  nisn?: string;
  classGrade?: string;
  school?: string;
  email?: string;
}): { success: boolean; user?: UserAccount; error?: string } => {
  const users = getStoredUsers();

  const cleanUsername = data.username.trim().toLowerCase();
  const cleanNisn = data.nisn?.trim();

  const existing = users.find(
    (u) =>
      u.username.toLowerCase() === cleanUsername ||
      (cleanNisn && u.nisn && u.nisn === cleanNisn)
  );

  if (existing) {
    return { success: false, error: 'Username atau NISN sudah terdaftar' };
  }

  const defaultPassword = data.role === 'admin' ? 'admin123' : 'siswa123';
  const newUser: UserAccount = {
    id: `usr_${data.role === 'admin' ? 'admin' : 'std'}_${Date.now()}`,
    username: cleanUsername,
    password: data.password || defaultPassword,
    fullName: data.fullName.trim(),
    role: data.role,
    nisn: cleanNisn || undefined,
    classGrade: data.role === 'student' ? (data.classGrade?.trim() || 'XI MIPA 2') : undefined,
    school: data.school?.trim() || 'SMA Negeri 1 Jakarta',
    email: data.email?.trim() || `${cleanUsername}@${data.role === 'admin' ? 'sekolah.sch.id' : 'siswa.belajar.id'}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [...users, newUser];
  saveStoredUsers(updated);

  // Sync to Supabase in background
  supabase
    .from('users')
    .insert({
      id: newUser.id,
      username: newUser.username,
      password: newUser.password,
      full_name: newUser.fullName,
      role: newUser.role,
      nisn: newUser.nisn,
      class_grade: newUser.classGrade,
      school: newUser.school,
      email: newUser.email,
    })
    .then(({ error }) => {
      if (error) console.info('Supabase users insert note:', error.message);
    });

  return { success: true, user: newUser };
};

export const addStudentUser = (data: {
  fullName: string;
  username: string;
  password?: string;
  nisn: string;
  classGrade: string;
  school: string;
  email?: string;
}): { success: boolean; user?: UserAccount; error?: string } => {
  return addUser({
    ...data,
    role: 'student',
  });
};

export const updateUser = (
  id: string,
  partial: Partial<UserAccount>
): boolean => {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;

  users[index] = { ...users[index], ...partial };
  saveStoredUsers(users);

  // If current logged in user is being updated, sync session
  const current = getCurrentUser();
  if (current && current.id === id) {
    setCurrentUser(users[index]);
  }

  // Sync to Supabase in background
  supabase
    .from('users')
    .update({
      full_name: users[index].fullName,
      username: users[index].username,
      password: users[index].password,
      role: users[index].role,
      nisn: users[index].nisn,
      class_grade: users[index].classGrade,
      school: users[index].school,
      email: users[index].email,
    })
    .eq('id', id)
    .then(({ error }) => {
      if (error) console.info('Supabase users update note:', error.message);
    });

  return true;
};

export const deleteUser = (id: string): boolean => {
  const users = getStoredUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;

  saveStoredUsers(filtered);

  // Sync delete to Supabase in background
  supabase
    .from('users')
    .delete()
    .eq('id', id)
    .then(({ error }) => {
      if (error) console.info('Supabase users delete note:', error.message);
    });

  return true;
};


