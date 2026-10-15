import React, { useState, useEffect } from 'react';
import { CHAPTERS_DATA } from './data/chapters';
import { Chapter, AssessmentRecord, StudentProgress, Question, UserAccount } from './types';
import { 
  getDefaultStudent, 
  checkSupabaseConnection, 
  fetchAssessmentResults, 
  saveAssessmentResult,
  getStudentProgress,
  updateStudentProgress
} from './services/supabaseService';
import { getCurrentUser, logoutUser } from './services/authService';
import { getStoredChapters, syncChaptersFromSupabase } from './services/chapterService';
import { LoginForm } from './components/LoginForm';
import { AdminDashboard } from './components/AdminDashboard';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ChapterCard } from './components/ChapterCard';
import { EbookViewer } from './components/EbookViewer';
import { PdfViewer } from './components/PdfViewer';
import { InteractiveVideoPlayer } from './components/InteractiveVideoPlayer';
import { AssessmentQuiz } from './components/AssessmentQuiz';
import { AssessmentResultModal } from './components/AssessmentResultModal';
import { CertificateModal } from './components/CertificateModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { ReportCardView } from './components/ReportCardView';

export default function App() {
  // User Authentication
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(getCurrentUser());

  // Dynamic Chapters from chapterService
  const [chapters, setChapters] = useState<Chapter[]>(getStoredChapters());
  const [selectedChapter, setSelectedChapter] = useState<Chapter>(chapters[0] || CHAPTERS_DATA[0]);
  const [activeTab, setActiveTab] = useState<'chapters' | 'ebook' | 'video' | 'assessment' | 'rapor'>('chapters');
  const [semesterFilter, setSemesterFilter] = useState<'all' | '1' | '2'>('all');

  // Student Profile
  const [student, setStudent] = useState(() => {
    const user = getCurrentUser();
    if (user && user.role === 'student') {
      return {
        name: user.fullName,
        school: user.school || 'SMA Negeri 1 Jakarta',
        classGrade: user.classGrade || 'XI MIPA 2',
        nisn: user.nisn || '0078129341',
      };
    }
    return getDefaultStudent();
  });

  // Assessment Records & Progress Map
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [progressMap, setProgressMap] = useState<Record<number, StudentProgress>>({});

  // Modals
  const [activeQuiz, setActiveQuiz] = useState<{ chapter: Chapter; type: 'pretest' | 'posttest' } | null>(null);
  const [activeResult, setActiveResult] = useState<{
    chapter: Chapter;
    record: AssessmentRecord;
    questions: Question[];
    studentAnswers: Record<number, number>;
  } | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<{ chapter: Chapter; record: AssessmentRecord } | null>(null);
  const [pdfChapter, setPdfChapter] = useState<Chapter | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Initialize Supabase Connection & Load Data
  const loadSupabaseData = async () => {
    await checkSupabaseConnection();
    const records = await fetchAssessmentResults(student.name);
    setAssessments(records);

    // Sync remote chapters from Supabase (including videos & media uploaded by admin)
    const syncedChapters = await syncChaptersFromSupabase();
    if (syncedChapters && syncedChapters.length > 0) {
      setChapters(syncedChapters);
      setSelectedChapter((prev) => syncedChapters.find((c) => c.id === prev.id) || syncedChapters[0]);
    }

    // Load progress for each chapter
    const pMap: Record<number, StudentProgress> = {};
    (syncedChapters || chapters).forEach((c) => {
      pMap[c.id] = getStudentProgress(c.id);
    });
    setProgressMap(pMap);
  };

  useEffect(() => {
    loadSupabaseData();
  }, [student.name]);

  // Handler when a Quiz is submitted
  const handleQuizSubmit = async (answers: Record<number, number>, questions: Question[]) => {
    if (!activeQuiz) return;
    const { chapter, type } = activeQuiz;

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });
    const calculatedScore = Math.round((correctCount / questions.length) * 100);

    // Existing assessment record if any
    const existing = assessments.find(a => a.chapterId === chapter.id);
    const preScore = type === 'pretest' ? calculatedScore : (existing?.pretestScore ?? 40);
    const postScore = type === 'posttest' ? calculatedScore : (existing?.posttestScore ?? 0);

    // Calculate N-Gain: (post - pre) / (100 - pre)
    let nGain = 0;
    if (100 - preScore > 0) {
      nGain = Number(((postScore - preScore) / (100 - preScore)).toFixed(2));
      if (nGain < 0) nGain = 0;
    }

    const passed = postScore >= 75;

    const newRecord: AssessmentRecord = {
      id: existing?.id || `rec_${Date.now()}`,
      studentName: student.name,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      pretestScore: preScore,
      posttestScore: postScore,
      nGainScore: nGain,
      passed,
      timestamp: new Date().toISOString(),
      answersSummary: {
        pretestAnswers: type === 'pretest' ? Object.values(answers) : (existing?.answersSummary?.pretestAnswers || []),
        posttestAnswers: type === 'posttest' ? Object.values(answers) : (existing?.answersSummary?.posttestAnswers || []),
      },
    };

    // Save to Supabase and local storage
    await saveAssessmentResult(newRecord);

    // Update Progress
    if (type === 'pretest') {
      updateStudentProgress(chapter.id, { pretestCompleted: true, pretestScore: calculatedScore });
      setProgressMap(prev => ({
        ...prev,
        [chapter.id]: { ...prev[chapter.id], pretestCompleted: true, pretestScore: calculatedScore },
      }));
    } else {
      updateStudentProgress(chapter.id, { posttestCompleted: true, posttestScore: calculatedScore });
      setProgressMap(prev => ({
        ...prev,
        [chapter.id]: { ...prev[chapter.id], posttestCompleted: true, posttestScore: calculatedScore },
      }));
    }

    // Refresh assessments state
    setAssessments(prev => [newRecord, ...prev.filter(r => r.chapterId !== chapter.id)]);

    // Close Quiz modal and open Result evaluation modal!
    setActiveQuiz(null);
    setActiveResult({
      chapter,
      record: newRecord,
      questions,
      studentAnswers: answers,
    });
  };

  // Video completion callback
  const handleVideoCompleted = (chapterId: number) => {
    updateStudentProgress(chapterId, { videoWatched: true, videoWatchPercentage: 100 });
    setProgressMap(prev => ({
      ...prev,
      [chapterId]: { ...prev[chapterId], videoWatched: true, videoWatchPercentage: 100 },
    }));
  };

  // E-book read callback
  const handleMarkEbookRead = (chapterId: number) => {
    const isCurrentlyRead = progressMap[chapterId]?.ebookRead || false;
    updateStudentProgress(chapterId, { ebookRead: !isCurrentlyRead });
    setProgressMap(prev => ({
      ...prev,
      [chapterId]: { ...prev[chapterId], ebookRead: !isCurrentlyRead },
    }));
  };

  // Filtered chapters
  const filteredChapters = chapters.filter(c => {
    if (semesterFilter === 'all') return true;
    return c.semester === Number(semesterFilter);
  });

  const completedCount = assessments.filter(a => a.passed).length;

  const handleRefreshChapters = () => {
    const updated = getStoredChapters();
    setChapters(updated);
    if (!updated.some(c => c.id === selectedChapter?.id) && updated.length > 0) {
      setSelectedChapter(updated[0]);
    }
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === 'student') {
      setStudent({
        name: user.fullName,
        school: user.school || 'SMA Negeri 1 Jakarta',
        classGrade: user.classGrade || 'XI MIPA 2',
        nisn: user.nisn || '0078129341',
      });
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // If not logged in, render LoginForm
  if (!currentUser) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // If logged in as Admin, render AdminDashboard
  if (currentUser.role === 'admin') {
    return (
      <AdminDashboard
        currentUser={currentUser}
        chapters={chapters}
        onRefreshChapters={handleRefreshChapters}
        assessments={assessments}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setPdfChapter(null);
        }}
        studentName={student.name}
        userRole={currentUser.role}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* PDF Document Viewer Mode */}
        {pdfChapter ? (
          <PdfViewer
            chapter={pdfChapter}
            onBack={() => setPdfChapter(null)}
            onOpenEbook={(ch) => {
              setSelectedChapter(ch);
              setPdfChapter(null);
              setActiveTab('ebook');
            }}
            onOpenVideo={(ch) => {
              setSelectedChapter(ch);
              setPdfChapter(null);
              setActiveTab('video');
            }}
          />
        ) : activeTab === 'ebook' ? (
          /* Interactive E-Book Viewer Mode */
          <EbookViewer
            chapters={chapters}
            currentChapter={selectedChapter}
            onSelectChapter={(ch) => setSelectedChapter(ch)}
            onOpenPdf={(ch) => setPdfChapter(ch)}
            onBack={() => setActiveTab('chapters')}
            onMarkAsRead={handleMarkEbookRead}
            isRead={progressMap[selectedChapter.id]?.ebookRead || false}
          />
        ) : activeTab === 'video' ? (
          /* Interactive Video Tutorial Mode */
          <InteractiveVideoPlayer
            chapter={selectedChapter}
            studentName={student.name}
            onVideoCompleted={handleVideoCompleted}
            onStartPosttest={(ch) => {
              setActiveQuiz({ chapter: ch, type: 'posttest' });
            }}
            onBack={() => setActiveTab('chapters')}
          />
        ) : activeTab === 'rapor' ? (
          /* Rapor & Sertifikat View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ReportCardView
              chapters={chapters}
              assessments={assessments}
              studentName={student.name}
              schoolName={student.school}
              onOpenCertificate={(ch, rec) => setActiveCertificate({ chapter: ch, record: rec })}
              onSelectChapter={(ch) => {
                setSelectedChapter(ch);
                setActiveTab('chapters');
              }}
            />
          </div>
        ) : (
          /* Chapters Catalog & Learning Dashboard */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Banner */}
            <HeroBanner
              onStartLearning={() => {
                setSelectedChapter(chapters[0]);
                setActiveTab('video');
              }}
              onExploreEbook={() => {
                setSelectedChapter(chapters[0]);
                setActiveTab('ebook');
              }}
              completedChaptersCount={completedCount}
              totalChaptersCount={chapters.length}
            />

            {/* Filter Tabs & Section Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Daftar Bab Pelajaran
                </h2>
                <p className="text-xs text-slate-500">
                  Pendidikan Agama Islam & Budi Pekerti
                </p>
              </div>

              {/* Semester Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  onClick={() => setSemesterFilter('all')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    semesterFilter === 'all'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({chapters.length})
                </button>
                <button
                  onClick={() => setSemesterFilter('1')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    semesterFilter === '1'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semester 1
                </button>
                <button
                  onClick={() => setSemesterFilter('2')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    semesterFilter === '2'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semester 2
                </button>
              </div>
            </div>

            {/* Grid of Chapter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChapters.map((chapter) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  progress={progressMap[chapter.id] || {
                    chapterId: chapter.id,
                    videoWatched: false,
                    videoWatchPercentage: 0,
                    pretestCompleted: false,
                    posttestCompleted: false,
                    ebookRead: false,
                    notesCount: 0,
                  }}
                  assessmentRecord={assessments.find(a => a.chapterId === chapter.id)}
                  onOpenEbook={(ch) => {
                    setSelectedChapter(ch);
                    setActiveTab('ebook');
                  }}
                  onOpenPdf={(ch) => {
                    setPdfChapter(ch);
                  }}
                  onOpenVideo={(ch) => {
                    setSelectedChapter(ch);
                    setActiveTab('video');
                  }}
                  onStartPretest={(ch) => {
                    setActiveQuiz({ chapter: ch, type: 'pretest' });
                  }}
                  onStartPosttest={(ch) => {
                    setActiveQuiz({ chapter: ch, type: 'posttest' });
                  }}
                  onViewCertificate={(ch, rec) => {
                    setActiveCertificate({ chapter: ch, record: rec });
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 mt-12 no-print text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-slate-600 font-medium">AKHLAQ KU · Kelas 11 SMA</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('rapor')}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              Rapor
            </button>
            <span>·</span>
            <span>Kurikulum Merdeka</span>
          </div>
        </div>
      </footer>

      {/* ===================== MODALS ===================== */}

      {/* Assessment Quiz Modal (Pre-Test / Post-Test) */}
      {activeQuiz && (
        <AssessmentQuiz
          chapter={activeQuiz.chapter}
          type={activeQuiz.type}
          onSubmit={handleQuizSubmit}
          onCancel={() => setActiveQuiz(null)}
        />
      )}

      {/* Assessment Results & Review Modal */}
      {activeResult && (
        <AssessmentResultModal
          chapter={activeResult.chapter}
          record={activeResult.record}
          questions={activeResult.questions}
          studentAnswers={activeResult.studentAnswers}
          onClose={() => setActiveResult(null)}
          onViewCertificate={() => {
            const ch = activeResult.chapter;
            const rec = activeResult.record;
            setActiveResult(null);
            setActiveCertificate({ chapter: ch, record: rec });
          }}
          onNextChapter={() => {
            const nextIdx = chapters.findIndex(c => c.id === activeResult.chapter.id) + 1;
            setActiveResult(null);
            if (nextIdx < chapters.length) {
              setSelectedChapter(chapters[nextIdx]);
              setActiveTab('video');
            }
          }}
        />
      )}

      {/* Official Certificate Modal */}
      {activeCertificate && (
        <CertificateModal
          chapter={activeCertificate.chapter}
          record={activeCertificate.record}
          schoolName={student.school}
          onClose={() => setActiveCertificate(null)}
        />
      )}

      {/* Student Profile Modal */}
      {isProfileOpen && (
        <StudentProfileModal
          currentName={student.name}
          currentSchool={student.school}
          assessments={assessments}
          onSave={(name, school) => {
            setStudent(prev => ({ ...prev, name, school }));
          }}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}
