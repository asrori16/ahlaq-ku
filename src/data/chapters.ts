import { Chapter } from '../types';

export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 1,
    number: '01',
    title: 'Menjaga Kehormatan Diri (Iffah) & Menghindari Pergaulan Bebas',
    shortTitle: 'Iffah & Batas Pergaulan Remaja',
    subtitle: 'Membentengi Diri dari Zina dan Perilaku Menyimpang di Era Modern',
    semester: 1,
    durationMinutes: 45,
    description: 'Memahami hakikat sikap Iffah (menjaga kesucian diri), mengidentifikasi bahaya laten pergaulan bebas dan zina, serta mengamalkan adab pergaulan islami bagi remaja SMA.',
    colorScheme: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-600',
      accent: 'emerald',
    },
    learningObjectives: [
      'Menganalisis larangan mendekati zina berdasarkan QS. Al-Isra\' [17]: 32 dan QS. An-Nur [24]: 2.',
      'Mengidentifikasi hakikat perilaku Iffah dalam kehidupan sehari-hari siswa SMA.',
      'Menjelaskan dampak negatif psikologis, sosial, dan kesehatan akibat pergaulan bebas.',
      'Menerapkan adab bergaul dengan lawan jenis serta menjaga pandangan (Ghadhdhul Bashar).'
    ],
    dalilUtama: {
      surah: "QS. Al-Isra' [17]: 32",
      arabic: "وَلَا تَقْرَبُوا الزِّنٰىٓ اِنَّهٗ كَانَ فَاحِشَةً ۗوَسَاۤءَ سَبِيْلًا",
      transliteration: "Wa lā taqrabuz-zinā innahū kāna fāḥisyataw wa sā'a sabīlā.",
      translation: "Dan janganlah kamu mendekati zina; (zina) itu sungguh suatu perbuatan keji, dan suatu jalan yang buruk."
    },
    ebookPages: [
      {
        pageNumber: 1,
        title: 'Hakikat Iffah: Menjaga Mahkota Kesucian Remaja Muslim',
        subsections: [
          {
            heading: '1. Pengertian Iffah Secara Bahasa dan Istilah',
            content: [
              'Secara etimologis, kata "Iffah" (العِفَّةُ) berasal dari kata ‘affa-ya’iffu-‘iffatan yang bermakna menahan diri dari sesuatu yang tidak halal dan tidak patut.',
              'Dalam terminologi akhlak Islam, iffah adalah sifat batiniah yang mengendalikan hawa nafsu syahwat dan amarah sehingga seseorang mampu menjaga kehormatan, kesucian jiwa, serta martabat dirinya sesuai tuntunan syariat.',
              'Imam Al-Ghazali dalam kitab Ihya\' \'Ulumuddin menyebutkan bahwa sifat iffah merupakan salah satu dari empat pilar utama induk akhlak mulia (ummuhatul fadhail), yang melahirkan sifat malu, sabar, qana\'ah, dan wara\'.'
            ],
            highlightQuote: 'Iffah bukanlah pengekangan yang membelenggu, melainkan benteng kehormatan yang memuliakan manusia di hadapan Allah dan sesama.',
            arabicQuote: {
              text: 'وَمَنْ يَسْتَعْفِفْ يُعِفَّهُ اللَّهُ وَمَنْ يَسْتَغْنِ يُغْنِهِ اللَّهُ',
              source: 'HR. Bukhari & Muslim',
              meaning: 'Barangsiapa yang berusaha menjaga kesucian dirinya (ber-iffah), niscaya Allah akan menjaganya; dan barangsiapa yang merasa cukup, niscaya Allah akan mencukupinya.'
            }
          },
          {
            heading: '2. Dimensi Iffah dalam Kehidupan Pelajar SMA',
            content: [
              'Iffah tidak terbatas pada urusan biologis, namun mencakup berbagai ranah kehidupan remaja:',
              'a. Iffatul Lisan: Menjaga lisan dari perkataan kotor, ghibah, dan obrolan bernada syahwat.',
              'b. Iffatul Bashar: Menjaga pandangan mata (Ghadhdhul Bashar) dari konten pornografi dan pandangan yang membangkitkan syahwat terlarang.',
              'c. Iffatul Bathn: Menjaga perut hanya dari asupan makanan yang halal dan thoyyib.',
              'd. Iffatul Farj: Menjaga kehormatan kemaluan dari perbuatan nista zina dan segala pintu gerbangnya.'
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Bahaya Pergaulan Bebas & Tahapan Menghindari Zina',
        subsections: [
          {
            heading: '1. Memahami Frasa "Jangan Mendekati Zina"',
            content: [
              'Perhatikan lafaz Al-Qur\'an dalam QS. Al-Isra\' ayat 32: Allah tidak sekadar berfirman "Jangan berzina", melainkan menggunakan redaksi "Wa la taqrabuz-zina" (Janganlah kalian mendekati zina).',
              'Para mufasir menjelaskan bahwa larangan mendekati jauh lebih tegas daripada sekadar larangan melakukan perbuatan intinya. Segala sarana, pemicu, suasana berkhalwat (berduaan), chatting mesra yang melampaui batas, dan pandangan mata liar telah diharamkan sebagai tindakan pencegahan (Saddudz-Dzari\'ah).'
            ],
            practicalTips: [
              'Hindari berada di tempat sepi berdua saja dengan lawan jenis yang bukan mahram.',
              'Batasi komunikasi pesan pribadi (chat) sebatas urusan belajar atau keperluan penting yang santun.',
              'Gunakan media sosial dengan bijak, hindari mengunggah foto diri yang memancing fitnah atau berpakaian ketat.',
              'Pilih lingkungan pertemanan positif yang saling mengingatkan dalam kebaikan dan ketaatan.'
            ]
          },
          {
            heading: '2. Dampak Destruktif Zina dan Pergaulan Bebas',
            content: [
              'Dampak Psikologis: Menghilangkan ketenangan batin, menimbulkan rasa bersalah yang berkepanjangan, depresi, dan merusak harga diri.',
              'Dampak Sosial & Akademis: Putus sekolah akibat kehamilan di luar nikah (KTD), sanksi sosial keluarga dan masyarakat, serta hilangnya masa depan pendidikan.',
              'Dampak Kesehatan: Risiko terjangkit Penyakit Menular Seksual (IMS) yang mematikan seperti HIV/AIDS, Gonore, dan Sifilis.'
            ]
          }
        ]
      },
      {
        pageNumber: 3,
        title: 'Panduan Praktis Pembiasaan Sikap Iffah di Lingkungan Sekolah',
        subsections: [
          {
            heading: '1. Strategi Pelajar Berkarakter Iffah',
            content: [
              'Sebagai generasi emas muslim tingkat SMA, kita dapat mempraktikkan langkah konkret berikut:',
              '1. Mengisi waktu luang dengan kegiatan produktif seperti ekstrakurikuler Rohis, olahraga, riset ilmiah, atau seni positif.',
              '2. Menumbuhkan rasa muraqabah (merasa selalu diawasi Allah SWT di manapun berada).',
              '3. Berpuasa sunnah (Senin-Kamis atau Dawud) saat dorongan hawa nafsu bergejolak, sesuai sabda Rasulullah SAW kepada para pemuda.'
            ]
          }
        ]
      }
    ],
    pdfContent: {
      moduleTitle: 'MODUL PEMBELAJARAN PAI & BUDI PEKERTI - KELAS 11 SMA',
      author: 'Tim MGMP PAI SMA Kurikulum Merdeka',
      schoolLevel: 'SMA / MA Kelas XI - Fase F',
      totalStudyHours: '3 Jam Pelajaran (3 x 45 Menit)',
      summaryPoints: [
        'Iffah adalah kemampuan spiritual dan moral untuk menahan diri dari hal-hal yang diharamkan Allah serta menjaga kehormatan diri.',
        'QS. Al-Isra\': 32 melarang mendekati zina (Saddudz-Dzari\'ah) karena zina merusak nasab, tatanan sosial, dan mengundang murka Allah.',
        'Ghadhdhul Bashar (menundukkan pandangan) adalah langkah protektif pertama dalam menjaga kesucian hati.',
        'Puasa sunnah dan pertemanan shalih merupakan benteng terbaik bagi remaja dalam membendung gelombang syahwat bebas.'
      ],
      caseStudies: [
        {
          caseTitle: 'Studi Kasus: Dilema Tekanan Teman Sebaya (Peer Pressure)',
          story: 'Faris (siswa kelas 11) diejek oleh teman-teman satu gengnya karena menolak diajak menonton video tidak senonoh di gawai dan tidak memiliki pacar. Mereka menyebut Faris ketinggalan zaman dan tidak gaul.',
          discussionQuestions: [
            'Bagaimana seharusnya sikap Faris menghadapi ejekan tersebut dengan berlandaskan nilai Iffah?',
            'Apakah memiliki pacar merupakan tolok ukur kedewasaan seorang remaja muslim?',
            'Langkah apa yang dapat dilakukan Faris agar tetap memiliki pertemanan yang sehat tanpa mengorbankan prinsip moralnya?'
          ]
        }
      ]
    },
    videoTutorial: {
      title: 'Video Pembelajaran Interaktif: Menjaga Kehormatan Remaja (Iffah) & Menjauhi Zina',
      youtubeId: 'k3a8W28vQyo', // YouTube educational video ID or direct streaming
      durationSeconds: 615,
      description: 'Penjelasan mendalam oleh Ustadz & Guru PAI mengenai tafsir QS. Al-Isra\': 32, konsep Iffah, batas pergaulan remaja SMA, dan cara membentengi diri di era gawai.',
      chaptersList: [
        { time: '00:00', seconds: 0, title: 'Pengantar & Fenomena Pergaulan Remaja Masa Kini' },
        { time: '01:45', seconds: 105, title: 'Tafsir QS. Al-Isra\' [17]: 32 & Makna Wa La Taqrabu' },
        { time: '03:30', seconds: 210, title: 'Definisi & Nilai Luhur Sikap Iffah' },
        { time: '05:50', seconds: 350, title: 'Checkpoint 1: Menguji Pemahaman Batas Pergaulan' },
        { time: '07:20', seconds: 440, title: 'Langkah Preventif: Ghadhdhul Bashar & Puasa' },
        { time: '09:10', seconds: 550, title: 'Refleksi Akhir & Resolusi Pribadi Remaja' }
      ],
      checkpoints: [
        {
          timestampSeconds: 210,
          label: 'Checkpoint Pemahaman Konsep',
          questionPrompt: 'Mengapa Al-Qur\'an menggunakan kata "Jangan Dekati Zina" dan bukan hanya "Jangan Berzina"?',
          options: [
            'Karena zina adalah dosa yang hanya berlaku bagi orang dewasa',
            'Untuk menegaskan bahwa segala pintu masuk dan perantara menuju zina wajib dihindari',
            'Karena mendekati zina hukumnya mubah asalkan tidak sampai berhubungan',
            'Agar manusia dapat mencoba sebagian pintu tanpa rasa bersalah'
          ],
          correctOption: 1,
          explanation: 'Kaidah Saddudz-Dzari\'ah menegaskan bahwa Allah mengharamkan sarana atau perantara (seperti khalwat, pandangan liar) untuk mencegah terjadinya dosa besar zina.'
        },
        {
          timestampSeconds: 440,
          label: 'Checkpoint Tindakan Praktis',
          questionPrompt: 'Solusi utama yang diajarkan Rasulullah SAW bagi pemuda yang belum mampu menikah agar terlindung dari dorongan syahwat adalah:',
          options: [
            'Menyibukkan diri dengan tidur sepanjang hari',
            'Melakukan pacaran islami dengan batas-batas tertentu',
            'Melaksanakan ibadah puasa (ash-shaum) sebagai perisai',
            'Mengisolasi diri dari seluruh kegiatan sekolah'
          ],
          correctOption: 2,
          explanation: 'Rasulullah SAW bersabda dalam hadits riwayat Bukhari: "Barangsiapa di antara kalian belum mampu (menikah), maka hendaklah ia berpuasa, karena puasa itu dapat menjadi perisai baginya".'
        }
      ],
      keyTakeaways: [
        'Larangan "jangan dekati zina" mencakup khalwat (berduaan), chatting mesra tanpa hajat, dan mengumbar aurat.',
        'Iffah adalah mahkota kehormatan yang membuat remaja muslim disegani dan diridhai Allah SWT.',
        'Menundukkan pandangan (ghadhdhul bashar) adalah benteng awal kejernihan hati dan ketenangan jiwa.',
        'Gunakan waktu muda untuk mengukir prestasi akademis dan spiritual, bukan terjebak pergaulan semu.'
      ]
    },
    pretest: [
      {
        id: 1,
        question: 'Perhatikan firman Allah SWT dalam QS. Al-Isra\' [17]: 32. Kata "فَاحِشَةً" (fāḥisyah) dalam ayat tersebut memiliki makna bahwa perbuatan zina merupakan perbuatan yang...',
        options: [
          'Biasa terjadi di masyarakat',
          'Sangat keji, buruk, dan melampaui batas fitrah kemanusiaan',
          'Dapat diampuni tanpa perlu taubat nasuha',
          'Hanya merugikan pelakunya sendiri secara materi'
        ],
        correctAnswer: 1,
        explanation: 'Fāḥisyah berarti perbuatan yang sangat keji dan melampaui batas keburukan secara akal sehat maupun syariat.',
        dalil: {
          source: "QS. Al-Isra': 32",
          meaning: "Sesungguhnya zina itu adalah suatu perbuatan yang keji dan suatu jalan yang buruk."
        }
      },
      {
        id: 2,
        question: 'Secara etimologi dan terminologi akhlak, sikap seorang muslim yang mampu menahan diri dari hal-hal yang diharamkan Allah serta menjaga kesucian dan martabat dirinya disebut...',
        options: ['Qana\'ah', 'Iffah', 'Amanah', 'Tawadhu\''],
        correctAnswer: 1,
        explanation: 'Iffah adalah sifat menahan diri dan menjaga kesucian serta kehormatan diri dari perbuatan yang tidak halal dan nista.',
        dalil: {
          source: 'Ihya Ulumuddin - Imam Al-Ghazali',
          meaning: 'Iffah merupakan keutamaan budi pekerti dalam mengendalikan dorongan nafsu syahwat di bawah bimbingan akal dan syariat.'
        }
      },
      {
        id: 3,
        question: 'Konsep "Saddudz-Dzari\'ah" dalam kaitannya dengan larangan mendekati zina bermakna...',
        options: [
          'Membolehkan hal yang haram dalam keadaan santai',
          'Menutup segala jalan, sarana, atau pintu yang dapat mengantarkan pada perbuatan zina',
          'Menghukum pelaku zina setelah mereka mengaku di depan umum',
          'Membuka pergaulan bebas asalkan saling menghormati'
        ],
        correctAnswer: 1,
        explanation: 'Saddudz-Dzari\'ah adalah kaidah ushul fiqih yang berarti menutup akses atau perantara menuju kemaksiatan untuk mencegah terjadinya dosa besar.',
        dalil: {
          source: 'Kaidah Ushul Fiqih',
          meaning: 'Segala hal yang mengantarkan kepada keharaman maka hukumnya ikut menjadi haram.'
        }
      },
      {
        id: 4,
        question: 'Perilaku berkhalwat (berduaan antara laki-laki dan perempuan bukan mahram di tempat sepi) dilarang dalam Islam karena...',
        options: [
          'Dapat mengganggu ketenangan tetangga sekitar',
          'Pihak ketiganya adalah setan yang menggoda untuk bermaksiat',
          'Hanya boleh dilakukan oleh orang dewasa',
          'Mengurangi waktu belajar siswa di sekolah'
        ],
        correctAnswer: 1,
        explanation: 'Rasulullah SAW bersabda: "Janganlah sekali-kali seorang pria berkhalwat dengan seorang wanita, melainkan setan menjadi yang ketiganya di antara mereka" (HR. Tirmidzi).',
        dalil: {
          source: 'HR. At-Tirmidzi No. 2165',
          meaning: 'Tidaklah seorang laki-laki berduaan dengan seorang wanita kecuali setan adalah pihak ketiganya.'
        }
      },
      {
        id: 5,
        question: 'Salah satu dampak medis paling berbahaya dan mematikan akibat pergaulan bebas dan gonta-ganti pasangan adalah infeksi...',
        options: ['Influenza tipe B', 'HIV / AIDS', 'Apendisitis akut', 'Hipertensi esensial'],
        correctAnswer: 1,
        explanation: 'HIV/AIDS menular secara dominan melalui hubungan seksual bebas yang berisiko, merusak sistem imunitas tubuh secara permanen.',
        dalil: {
          source: 'Kemenkes RI & Riset Medis',
          meaning: 'Pergaulan bebas dan seks pranikah merupakan faktor transmisi utama IMS dan HIV pada kelompok remaja.'
        }
      }
    ],
    posttest: [
      {
        id: 1,
        question: 'Mengapa Al-Qur\'an secara khusus menggunakan redaksi "Wa lā taqrabuz-zinā" (Dan janganlah kamu mendekati zina) dalam QS. Al-Isra\' ayat 32?',
        options: [
          'Karena mendekati zina lebih berat dosanya daripada berzina',
          'Karena mendekati adalah pintu masuk yang pasti memicu jatuhnya seseorang ke dalam lumpur zina jika tidak dibendung sejak awal',
          'Hanya sebagai saran yang sifatnya anjuran moral biasa',
          'Karena zina hanya terjadi jika ada paksaan fisik'
        ],
        correctAnswer: 1,
        explanation: 'Penggunaan kata "jangan mendekati" merupakan bentuk preventif tertinggi dalam sastra syariat, karena fitrah manusia lemah jika sudah membiarkan dirinya berada di bibir jurang syahwat.',
        dalil: {
          source: 'Tafsir Ibnu Katsir QS. Al-Isra\': 32',
          meaning: 'Allah mengharamkan segala pemicu, pandangan, sentuhan, dan suasana yang mendorong pada perbuatan keji tersebut.'
        }
      },
      {
        id: 2,
        question: 'Riko diajak temannya untuk ikut menonton tayangan pornografi di kamar kos yang sepi. Berdasarkan prinsip Iffah dan muraqabatullah, tindakan terbaik Riko adalah...',
        options: [
          'Ikut menonton sebentar agar tidak dijauhi teman',
          'Menolak dengan santun, mengingatkan temannya tentang bahaya dosa, dan segera meninggalkan tempat tersebut',
          'Diam saja dan merekam kejadian tersebut untuk disebarkan',
          'Menonton sambil membaca istighfar di dalam hati'
        ],
        correctAnswer: 1,
        explanation: 'Seorang yang memiliki sifat Iffah berani bersikap tegas terhadap kemaksiatan dengan cara santun dan menjauhkan dirinya dari lingkungan tercela.',
        dalil: {
          source: "QS. An-Nur: 30",
          meaning: "Katakanlah kepada orang laki-laki yang beriman: Hendaklah mereka menahan pandangannya, dan memelihara kemaluannya; yang demikian itu adalah lebih suci bagi mereka."
        }
      },
      {
        id: 3,
        question: 'Manakah di bawah ini yang merupakan wujud penerapan "Ghadhdhul Bashar" bagi seorang pelajar saat berselancar di media sosial?',
        options: [
          'Memberikan komentar pujian fisik pada foto lawan jenis yang membuka aurat',
          'Langsung menggeser (scroll away), memblokir, atau tidak melihat konten foto/video yang mengumbar aurat dan syahwat',
          'Menyimpan konten tersebut untuk bukti evaluasi',
          'Membagikan video tersebut ke grup kelas agar teman-teman waspada'
        ],
        correctAnswer: 1,
        explanation: 'Ghadhdhul Bashar digital diwujudkan dengan menjaga jemari dan mata dari paparan visual yang haram di lini masa media sosial.',
        dalil: {
          source: 'HR. Muslim',
          meaning: 'Rasulullah SAW bersabda tentang pandangan mendadak (fuj\'ah): "Palingkanlah pandanganmu!".'
        }
      },
      {
        id: 4,
        question: 'Berdasarkan QS. An-Nur [24]: 2, hukuman bagi pelaku zina ghairu muhshan (orang yang belum pernah menikah secara sah) adalah...',
        options: [
          'Didera (dicambuk) 100 kali',
          'Dihukum rajam sampai meninggal dunia',
          'Membayar denda 100 ekor unta',
          'Dipenjara seumur hidup'
        ],
        correctAnswer: 0,
        explanation: 'Pelaku zina ghairu muhshan (perawan/bujang) didera sebanyak seratus kali cambukan berdasarkan ketetapan QS. An-Nur: 2.',
        dalil: {
          source: 'QS. An-Nur [24]: 2',
          meaning: 'Pezina perempuan dan pezina laki-laki, deralah masing-masing dari keduanya seratus kali dera...'
        }
      },
      {
        id: 5,
        question: 'Dampak jangka panjang bagi anak yang lahir dari hubungan zina di luar pernikahan menurut hukum Islam adalah...',
        options: [
          'Tidak boleh bersekolah di lembaga pendidikan manapun',
          'Nasabnya hanya bersambung kepada ibunya, tidak memiliki hak waris dan wali nikah dari ayah biologisnya',
          'Harus menanggung seluruh dosa orang tuanya',
          'Otomatis terbebas dari seluruh kewajiban syariat'
        ],
        correctAnswer: 1,
        explanation: 'Secara fiqih Islam, anak luar nikah tidak dinasabkan kepada laki-laki yang menzinai ibunya, melainkan hanya bernasab kepada ibu yang melahirkannya, demi menjaga kesucian nasab syar\'i.',
        dalil: {
          source: 'HR. Bukhari & Muslim',
          meaning: 'Al-waladu lil-firasy wa lil-\'ahiril-hajar (Anak itu dinasabkan bagi pemilik tempat tidur yang sah/pernikahan, dan bagi pezina adalah kerugian).'
        }
      }
    ]
  },
  {
    id: 2,
    number: '02',
    title: 'Membiasakan Akhlak Terpuji: Syaja\'ah (Berani Membela Kebenaran)',
    shortTitle: 'Syaja\'ah: Keberanian Moral',
    subtitle: 'Menegakkan Kebenaran, Kejujuran Akademik & Melawan Perundungan (Bullying)',
    semester: 1,
    durationMinutes: 45,
    description: 'Meneladani keberanian hakiki (Syaja\'ah) dalam Islam, membedakan antara keberanian terpuji dengan kecerobohan (Tahawwur) atau kepengecutan (Jubun), serta mewujudkannya dalam anti-bullying dan integritas kejujuran.',
    colorScheme: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-600',
      accent: 'amber',
    },
    learningObjectives: [
      'Menganalisis makna Syaja\'ah berdasarkan QS. Ali \'Imran [3]: 139 dan hadis Rasulullah SAW.',
      'Membedakan Syaja\'ah Harbiyyah (perang/fisik) dan Syaja\'ah Nafsiyyah (keberanian jiwa/moral).',
      'Menerapkan sikap Syaja\'ah dalam menolak perundungan (bullying) dan praktek mencontek di sekolah.',
      'Menjelaskan faktor-faktor yang menumbuhkan keberanian membela kebenaran secara santun.'
    ],
    dalilUtama: {
      surah: "QS. Ali 'Imran [3]: 139",
      arabic: "وَلَا تَهِنُوْا وَلَا تَحْزَنُوْا وَاَنْتُمُ الْاَعْلَوْنَ اِنْ كُنْتُمْ مُّؤْمِنِيْنَ",
      transliteration: "Wa lā tahinū wa lā taḥzanū wa antumul-a'launa in kuntum mu'minīn.",
      translation: "Dan janganlah kamu (merasa) lemah, dan janganlah (pula) bersedih hati, sebab kamu paling tinggi (derajatnya), jika kamu orang-orang yang beriman."
    },
    ebookPages: [
      {
        pageNumber: 1,
        title: 'Makna & Filosofi Syaja\'ah dalam Khazanah Islam',
        subsections: [
          {
            heading: '1. Definisi Syaja\'ah',
            content: [
              'Kata Syaja\'ah (الشَّجَاعَةُ) secara bahasa berarti berani, gagah, atau perkasa.',
              'Dalam istilah akhlak, syaja\'ah adalah keteguhan hati, kekuatan jiwa, dan kesiapan mental untuk membela kebenaran serta menolak kezaliman semata-mata mengharap ridha Allah SWT.',
              'Syaja\'ah berada di posisi pertengahan yang mulia (I\'tidal) antara dua sifat ekstrem yang tercela: Tahawwur (nekat, ceroboh tanpa perhitungan) dan Jubun (pengecut, takut menyatakan kebenaran).'
            ],
            highlightQuote: 'Bukanlah orang pemberani yang jago bergulat dan mengalahkan manusia, tetapi orang yang mampu mengendalikan dirinya saat marah demi kebenaran.',
            arabicQuote: {
              text: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
              source: 'HR. Bukhari & Muslim',
              meaning: 'Bukanlah orang kuat itu yang menang dalam bergulat, melainkan orang kuat adalah yang mampu mengendalikan dirinya ketika marah.'
            }
          },
          {
            heading: '2. Pembagian Syaja\'ah',
            content: [
              '1. Syaja\'ah Harbiyyah: Keberanian fisik di medan perjuangan untuk melindungi agama dan kedaulatan tanah air.',
              '2. Syaja\'ah Nafsiyyah: Keberanian moral dan psikologis dalam kehidupan sehari-hari, meliputi:',
              '   - Keberanian mengakui kesalahan diri sendiri dan meminta maaf.',
              '   - Keberanian menegur teman yang melakukan maksiat atau bullying dengan cara arif.',
              '   - Keberanian berkata jujur meski dalam keadaan tertekan.',
              '   - Keberanian menjaga rahasia amanah yang dipercayakan.'
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Manifestasi Syaja\'ah Pelajar: Melawan Bullying & Menjaga Kejujuran',
        subsections: [
          {
            heading: '1. Sikap Tegas Melawan Bullying (Perundungan)',
            content: [
              'Perundungan verbal, fisik, maupun siber (cyberbullying) adalah kezaliman nyata yang diharamkan dalam Islam (QS. Al-Hujurat: 11).',
              'Siswa yang memiliki karakter Syaja\'ah tidak akan menjadi penonton pasif (bystander) ketika melihat temannya ditindas. Ia berani membela korban atau melapor kepada guru BK dengan bijak.'
            ],
            practicalTips: [
              'Katakan "Hentikan, itu tidak pantas!" saat melihat teman mengejek atau mempermalukan orang lain.',
              'Rangkul teman yang menjadi korban bullying dan berikan dukungan moral.',
              'Laporkan ke pihak sekolah jika perundungan membahayakan fisik atau psikologis teman.'
            ]
          },
          {
            heading: '2. Kejujuran Akademik (Anti-Mencontek)',
            content: [
              'Mencontek saat ujian adalah bentuk kepengecutan intelektual dan pengkhianatan amanah (khiyanah).',
              'Siswa pemberani lebih memilih nilai apa adanya hasil ikhtiar jujur daripada nilai tinggi hasil manipulasi, karena ia yakin Allah Maha Melihat.'
            ]
          }
        ]
      }
    ],
    pdfContent: {
      moduleTitle: 'MODUL SYAJA\'AH: KEBERANIAN MEMBELA KEBENARAN - KELAS 11 SMA',
      author: 'Tim MGMP PAI SMA Kurikulum Merdeka',
      schoolLevel: 'SMA / MA Kelas XI - Fase F',
      totalStudyHours: '3 Jam Pelajaran (3 x 45 Menit)',
      summaryPoints: [
        'Syaja\'ah adalah keberanian moral berlandaskan iman, bukan arogansi atau kenekatan buta.',
        'Sifat penakut (Jubun) dan ceroboh membabi-buta (Tahawwur) adalah dua kutub tercela yang harus dihindari.',
        'Wujud nyata Syaja\'ah di sekolah: jujur dalam ujian, membela teman dari perundungan, dan berani menyampaikan aspirasi dengan santun.',
        'Rasa takut hanya layak ditujukan kepada Allah SWT, bukan kepada manusia yang menekan kebenaran.'
      ],
      caseStudies: [
        {
          caseTitle: 'Studi Kasus: Menolak Kunci Jawaban Bocor',
          story: 'Menjelang Penilaian Akhir Semester (PAS), sekelompok siswa populer mengedarkan kunci jawaban ujian di grup tertutup dan mengajak seluruh kelas iuran. Dimas ragu apakah harus ikut atau menolak.',
          discussionQuestions: [
            'Berdasarkan nilai Syaja\'ah, keputusan apa yang harus diambil Dimas?',
            'Bagaimana cara Dimas menyampaikan penolakannya tanpa menimbulkan permusuhan fisik?',
            'Apa akibat jangka panjang bagi karakter bangsa jika ketidakjujuran dibiasakan sejak bangku sekolah?'
          ]
        }
      ]
    },
    videoTutorial: {
      title: 'Video Pembelajaran: Syaja\'ah - Menjadi Remaja Berani, Adil & Berintegritas',
      youtubeId: 'e2Dau2P2v1M',
      durationSeconds: 580,
      description: 'Membahas tuntas konsep Syaja\'ah dalam Islam, kisah sahabat Rasulullah yang pemberani, serta aplikasi praktis bagi siswa SMA dalam menghadapi bullying dan ujian.',
      chaptersList: [
        { time: '00:00', seconds: 0, title: 'Arti Sejati Keberanian dalam Islam' },
        { time: '02:00', seconds: 120, title: 'Tafsir QS. Ali \'Imran: 139 & Jangan Merasa Lemah' },
        { time: '04:15', seconds: 255, title: 'Beda Syaja\'ah vs Tahawwur vs Jubun' },
        { time: '06:00', seconds: 360, title: 'Checkpoint 1: Kuis Situasional Anti-Bullying' },
        { time: '07:45', seconds: 465, title: 'Integritas Akademik & Keberanian Berkata Jujur' },
        { time: '09:00', seconds: 540, title: 'Rangkuman & Doa Menghilangkan Sifat Penakut' }
      ],
      checkpoints: [
        {
          timestampSeconds: 255,
          label: 'Checkpoint Konsep Keberanian',
          questionPrompt: 'Sikap berani yang melampaui batas tanpa perhitungan akal sehat dan membahayakan diri tanpa tujuan syar\'i disebut:',
          options: [
            'Jubun (Pengecut)',
            'Tahawwur (Kecerobohan/Nekat)',
            'Syaja\'ah Nafsiyyah',
            'Iffah'
          ],
          correctOption: 1,
          explanation: 'Tahawwur adalah sikap nekat tanpa perhitungan dan pertimbangan hikmah, yang merupakan lawan ekstrem dari sikap jubun (pengecut).'
        },
        {
          timestampSeconds: 465,
          label: 'Checkpoint Aplikasi Sekolah',
          questionPrompt: 'Manakah bentuk keberanian jiwa (Syaja\'ah Nafsiyyah) tertinggi saat seorang siswa menyadari dirinya berbuat salah kepada temannya?',
          options: [
            'Menutupi kesalahan dengan menyalahkan orang lain',
            'Mengakui kesalahan dengan berjiwa besar dan segera meminta maaf',
            'Mendiamkan masalah agar terlupakan dengan sendirinya',
            'Menantang teman tersebut agar tidak berani menuntut'
          ],
          correctOption: 1,
          explanation: 'Keberanian mengakui kekeliruan dan meminta maaf membutuhkan kerendahan hati dan keteguhan jiwa yang luar biasa (Syaja\'ah Nafsiyyah).'
        }
      ],
      keyTakeaways: [
        'Syaja\'ah bersumber dari keyakinan tauhid yang kokoh bahwa ajal, rezeki, dan perlindungan berada di tangan Allah semata.',
        'Seorang muslim tidak boleh merasa rendah diri atau takut menyuarakan kebenaran.',
        'Berani membela yang lemah dan menentang perundungan adalah bagian dari amal ma\'ruf nahi munkar.',
        'Kejujuran dalam belajar melatih jiwa kepemimpinan masa depan.'
      ]
    },
    pretest: [
      {
        id: 1,
        question: 'Lawan kata (antonim) dari sifat Syaja\'ah yang berarti penakut atau pengecut adalah...',
        options: ['Tahawwur', 'Al-Jubun', 'Al-Kadzib', 'Al-Hasad'],
        correctAnswer: 1,
        explanation: 'Al-Jubun (الجُبْنُ) berarti sifat penakut atau pengecut yang ragu membela kebenaran.',
        dalil: {
          source: 'Doa Ma\'tsur Nabi SAW',
          meaning: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari sifat lemah dan pengecut (al-jubn).'
        }
      },
      {
        id: 2,
        question: 'Kondisi di mana seseorang memiliki keberanian fisik yang membabi-buta tanpa pertimbangan akal dan syariat disebut...',
        options: ['Tahawwur', 'Syaja\'ah Harbiyyah', 'Tawadhu\'', 'Wara\''],
        correctAnswer: 0,
        explanation: 'Tahawwur adalah sikap nekat atau ceroboh yang melampaui batas kewajaran.',
        dalil: {
          source: 'Kitab Akhlak Al-Mawardi',
          meaning: 'Keberanian sejati adalah jalan tengah antara kepengecutan dan kenekatan yang membabi buta.'
        }
      },
      {
        id: 3,
        question: 'Berdasarkan QS. Ali \'Imran: 139, seorang mukmin tidak boleh merasa lemah dan bersedih hati karena...',
        options: [
          'Mereka memiliki kekayaan materi terbanyak',
          'Derajat orang beriman paling tinggi di sisi Allah jika benar-benar beriman',
          'Kemenangan duniawi sudah pasti tanpa perlu berikhtiar',
          'Mereka tidak akan pernah diuji dengan kesulitan'
        ],
        correctAnswer: 1,
        explanation: 'Ayat ini menegaskan: "...kamu adalah orang-orang yang paling tinggi derajatnya, jika kamu orang-orang yang beriman".',
        dalil: {
          source: "QS. Ali 'Imran: 139",
          meaning: "Janganlah kamu merasa lemah dan janganlah bersedih hati, sebab kamu paling tinggi derajatnya jika kamu beriman."
        }
      },
      {
        id: 4,
        question: 'Contoh nyata penerapan Syaja\'ah Nafsiyyah dalam ranah akademik bagi siswa SMA adalah...',
        options: [
          'Membolos sekolah bersama teman satu kelompok',
          'Berani menolak tawaran kunci jawaban ilegal dan tetap mengerjakan soal ujian dengan jujur',
          'Menantang guru berdebat di luar materi pelajaran',
          'Memamerkan nilai tertinggi di hadapan teman'
        ],
        correctAnswer: 1,
        explanation: 'Kejujuran akademik membutuhkan keberanian moral untuk menolak kecurangan meskipun ada tekanan kelompok.',
        dalil: {
          source: 'HR. Muslim',
          meaning: 'Barangsiapa mencurangi kami, maka ia bukan golongan kami.'
        }
      },
      {
        id: 5,
        question: 'Faktor fundamental yang paling utama dalam melahirkan sifat Syaja\'ah pada diri seorang muslim adalah...',
        options: [
          'Kekuatan fisik dan kemampuan bela diri',
          'Keimanan dan rasa takut semata-mata hanya kepada Allah SWT (Tauhid)',
          'Banyaknya pengikut dan teman sebaya',
          'Jabatan sosial keluarga di masyarakat'
        ],
        correctAnswer: 1,
        explanation: 'Ketauhidan yang murni membuat seseorang yakin bahwa tiada yang dapat mendatangkan manfaat atau bahaya melainkan atas izin Allah.',
        dalil: {
          source: 'QS. At-Taubah: 18',
          meaning: '...dan mereka tidak takut kepada siapapun selain kepada Allah semata.'
        }
      }
    ],
    posttest: [
      {
        id: 1,
        question: 'Bagaimanakah sikap Syaja\'ah yang tepat saat kita melihat seorang siswa di pojok kantin sedang diintimidasi (dibully) oleh senior?',
        options: [
          'Merekam video kejadian tersebut untuk hiburan media sosial pribadi',
          'Berani mengambil tindakan terukur: menegur dengan sopan untuk menghentikan atau segera memanggil guru pengawas',
          'Berpura-pura tidak melihat agar tidak ikut dipukuli',
          'Mendukung senior agar diakui sebagai teman dekat'
        ],
        correctAnswer: 1,
        explanation: 'Sikap Syaja\'ah menuntut kepedulian aktif membela yang terzalimi tanpa mencelakakan diri sendiri dengan cara bijak dan melibatkan otoritas sekolah.',
        dalil: {
          source: 'HR. Bukhari',
          meaning: 'Tolonglah saudaramu baik dia dalam keadaan berbuat zalim maupun yang terzalimi.'
        }
      },
      {
        id: 2,
        question: 'Mengapa Rasulullah SAW menyatakan bahwa jihad yang paling utama adalah menyampaikan kebenaran di hadapan penguasa yang zalim?',
        options: [
          'Karena membutuhkan keberanian moral luar biasa dengan risiko keselamatan diri demi kemaslahatan umat',
          'Karena pelakunya pasti akan langsung mendapat imbalan harta',
          'Hanya sebagai kiasan politik belaka',
          'Karena penguasa pasti akan selalu menerima kritik'
        ],
        correctAnswer: 0,
        explanation: 'Rasulullah SAW bersabda: "Jihad yang paling utama adalah kalimat yang haq di hadapan penguasa yang zalim" (HR. Abu Dawud).',
        dalil: {
          source: 'HR. Abu Dawud No. 4344',
          meaning: 'Afkhalul jihadi kalimatu haqqin \'inda sulthanin ja\'ir.'
        }
      },
      {
        id: 3,
        question: 'Pernyataan berikut yang membedakan secara tepat antara Syaja\'ah dan Tahawwur adalah...',
        options: [
          'Syaja\'ah didorong oleh keimanan dan akal sehat, sedangkan Tahawwur didorong oleh hawa nafsu dan kesombongan',
          'Syaja\'ah selalu takut menghadapi bahaya, sedangkan Tahawwur tidak pernah ragu',
          'Syaja\'ah khusus untuk urusan perang fisik saja',
          'Tahawwur adalah sifat terpuji bagi para pejuang'
        ],
        correctAnswer: 0,
        explanation: 'Syaja\'ah berpijak pada kematangan kalkulasi iman dan hikmah, sedangkan Tahawwur adalah kenekatan buta tanpa pertimbangan akibat buruknya.',
        dalil: {
          source: 'Kitab Tahdzibul Akhlaq',
          meaning: 'Keberanian terpuji selalu dipandu oleh pertimbangan akal budi dan kemaslahatan syariat.'
        }
      },
      {
        id: 4,
        question: 'Saat seseorang berani mengakui kekhilafan dirinya dan meminta maaf secara terbuka kepada orang yang pernah disakitinya, ia telah mengamalkan...',
        options: [
          'Syaja\'ah Harbiyyah',
          'Syaja\'ah Nafsiyyah',
          'Tahawwur',
          'Nifaq'
        ],
        correctAnswer: 1,
        explanation: 'Mengakui kesalahan dan memohon maaf adalah bentuk keberanian menundukkan ego diri (Syaja\'ah Nafsiyyah).',
        dalil: {
          source: 'HR. Muslim',
          meaning: 'Tidaklah seorang hamba memaafkan kezaliman melainkan Allah akan menambah kemuliaan baginya.'
        }
      },
      {
        id: 5,
        question: 'Doa ma\'tsur yang diajarkan Rasulullah SAW untuk memohon perlindungan dari sifat pengecut (jubun) dan sifat lemah adalah...',
        options: [
          'Allahumma inni a\'udzu bika minal \'ajzi wal kasali wal jubni...',
          'Rabbana atina fid dunya hasanah...',
          'Allahumma inni as\'aluka \'ilman nafi\'a...',
          'Rabbi zidni \'ilma warzuqni fahma...'
        ],
        correctAnswer: 0,
        explanation: 'Doa ma\'tsur dari hadits Bukhari memohon perlindungan dari kelemahan (\'ajz), kemalasan (kasal), dan kepengecutan (jubn).',
        dalil: {
          source: 'HR. Bukhari No. 2893',
          meaning: 'Ya Allah, aku berlindung kepada-Mu dari kelemahan, kemalasan, sifat pengecut, dan kepikunan.'
        }
      }
    ]
  },
  {
    id: 3,
    number: '03',
    title: 'Menghindari Akhlak Tercela: Riya\', Sum\'ah, Nifaq, Hasad, dan Ghadhab',
    shortTitle: 'Penyakit Hati & Pengendalian Emosi',
    subtitle: 'Membersihkan Hati dari Racun Jiwa & Mengelola Amarah di Era Digital',
    semester: 1,
    durationMinutes: 45,
    description: 'Mengidentifikasi penyakit-penyakit hati yang menghapus pahala amal (Riya\', Sum\'ah, Hasad, Nifaq), memahami bahaya ghadhab (marah), dan mempraktikkan tazkiyatun nafs (penyucian jiwa).',
    colorScheme: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      badge: 'bg-rose-600',
      accent: 'rose',
    },
    learningObjectives: [
      'Menganalisis bahaya Riya\' dan Sum\'ah berdasarkan QS. Al-Baqarah [2]: 264 dan QS. Al-Ma\'un: 4-6.',
      'Membedakan tanda-tanda kemunafikan (Nifaq) baik itiqadi maupun amali.',
      'Menjelaskan bahaya Hasad (dengki) sebagai pemakan pahala kebaikan.',
      'Menerapkan langkah-langkah islami dalam meredam amarah (Ghadhab).'
    ],
    dalilUtama: {
      surah: "QS. Al-Baqarah [2]: 264",
      arabic: "يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوْا لَا تُبْطِلُوْا صَدَقٰتِكُمْ بِالْمَنِّ وَالْاَذٰى كَالَّذِيْ يُنْفِقُ مَالَهٗ رِئَاۤءَ النَّاسِ",
      transliteration: "Yā ayyuhallażīna āmanū lā tubṭilū ṣadaqātikum bil-manni wal-ażā kallażī yunfiqu mālahū ri'ā'an-nās.",
      translation: "Wahai orang-orang yang beriman, janganlah kamu membatalkan sedekahmu dengan menyebut-nyebutnya dan menyakiti (perasaan penerima), seperti orang yang menginfakkan hartanya karena riya (pamer) kepada manusia."
    },
    ebookPages: [
      {
        pageNumber: 1,
        title: 'Mengenal Riya\' dan Sum\'ah: Syirik Kecil Penghapus Pahala',
        subsections: [
          {
            heading: '1. Riya\' dan Sum\'ah di Era Pamer Media Sosial',
            content: [
              'Riya\' (الرِّيَاءُ) berasal dari kata ru\'yah yang berarti melihat; yaitu memperlihatkan amal ibadah kepada orang lain agar mendapat sanjungan dan popularitas.',
              'Sum\'ah (السُّمْعَةُ) berasal dari kata sama\' yang berarti mendengar; yaitu menceritakan atau memperdengarkan amal kebajikan yang telah dikerjakan agar didengar dan dikagumi khalayak.',
              'Rasulullah SAW menyebut riya\' sebagai Asy-Syirkul Ashghar (syirik kecil) yang paling beliau takuti menimpa umatnya.'
            ],
            highlightQuote: 'Amal yang dicampuri riya\' bagaikan debu di atas batu licin yang disiram air hujan lebat; semuanya lenyap tanpa menyisakan pahala sedikit pun.',
            arabicQuote: {
              text: 'إِنَّ أَخْوَفَ مَا أَخَافُ عَلَيْكُمُ الشِّرْكُ الأَصْغَرُ: الرِّيَاءُ',
              source: 'HR. Ahmad',
              meaning: 'Sesungguhnya hal yang paling aku khawatirkan menimpa kalian adalah syirik kecil, yaitu riya\'.'
            }
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Hasad (Dengki) & Ghadhab (Marah): Terapi Qurani Mengobatinya',
        subsections: [
          {
            heading: '1. Racun Hasad yang Membakar Kebaikan',
            content: [
              'Hasad adalah perasaan tidak senang melihat orang lain memperoleh kenikmatan, disertai harapan agar kenikmatan tersebut hilang dari orang itu.',
              'Rasulullah SAW memperingatkan: "Jauhilah sifat hasad (dengki), karena hasad itu memakan kebaikan sebagaimana api memakan kayu bakar" (HR. Abu Dawud).'
            ]
          },
          {
            heading: '2. Cara Meredam Ghadhab (Amarah)',
            content: [
              '1. Membaca ta\'awwudz untuk mengusir bisikan setan (A\'udzu billahi minasy-syaithanir-rajim).',
              '2. Diam dan tidak mengeluarkan kata-kata makian atau sumpah serapah.',
              '3. Mengubah posisi tubuh: jika sedang berdiri hendaklah duduk, jika sedang duduk hendaklah berbaring.',
              '4. Mengambil air wudhu, karena marah bersumber dari api setan dan api dipadamkan dengan air.'
            ]
          }
        ]
      }
    ],
    pdfContent: {
      moduleTitle: 'MODUL PEMBERSIHAN HATI DARI AKHLAK TERCELA - KELAS 11 SMA',
      author: 'Tim MGMP PAI SMA Kurikulum Merdeka',
      schoolLevel: 'SMA / MA Kelas XI - Fase F',
      totalStudyHours: '3 Jam Pelajaran (3 x 45 Menit)',
      summaryPoints: [
        'Riya\' dan Sum\'ah merusak keikhlasan ibadah dan menjadikannya sia-sia di hadapan Allah SWT.',
        'Hasad lahir dari ketidakterimaan hati terhadap takdir pembagian rezeki Allah kepada hamba-Nya.',
        'Nifaq amali ditandai dengan dusta saat berbicara, ingkar saat berjanji, dan khianat saat diberi amanah.',
        'Wudhu, diam, dan mengingat pahala menahan amarah adalah senjata utama mengalahkan ghadhab.'
      ],
      caseStudies: [
        {
          caseTitle: 'Studi Kasus: Flexing Ibadah di Status Media Sosial',
          story: 'Nadia selalu mengunggah foto sajadah, ayat tahajud jam 3 pagi, dan bukti transfer sedekah ke story Instagram dengan tulisan "Alhamdulillah selesai tilawah 2 juz hari ini, semoga istiqomah".',
          discussionQuestions: [
            'Apakah tindakan Nadia berpotensi terjerumus dalam riya\' dan sum\'ah?',
            'Kapan sebuah unggahan diperbolehkan untuk syiar dan kapan harus disembunyikan?',
            'Bagaimana cara menjaga niat agar tetap murni lillahi ta\'ala?'
          ]
        }
      ]
    },
    videoTutorial: {
      title: 'Video Pembelajaran: Waspada Penyakit Hati (Riya, Hasad, Nifaq, Ghadhab)',
      youtubeId: 'B3Z2P3x7Q4w',
      durationSeconds: 590,
      description: 'Membahas bahaya riya di media sosial, tanda-tanda nifaq, dan manajemen amarah sesuai sunnah Rasulullah SAW.',
      chaptersList: [
        { time: '00:00', seconds: 0, title: 'Bahaya Laten Penyakit Hati' },
        { time: '01:50', seconds: 110, title: 'Hakikat Riya\' & Sum\'ah: Syirik Kecil' },
        { time: '03:40', seconds: 220, title: 'Bahaya Hasad (Iri Dengki) Memakan Pahala' },
        { time: '05:30', seconds: 330, title: 'Checkpoint: Deteksi Niat Ibadah' },
        { time: '07:15', seconds: 435, title: 'Sunnah Rasulullah dalam Mengatasi Marah' },
        { time: '09:00', seconds: 540, title: 'Doa Tazkiyatun Nafs' }
      ],
      checkpoints: [
        {
          timestampSeconds: 220,
          label: 'Checkpoint Hasad vs Ghibthah',
          questionPrompt: 'Iri yang diperbolehkan dalam Islam (Ghibthah) adalah menginginkan kebaikan yang sama tanpa berharap hilangnya nikmat dari orang lain, khususnya dalam hal:',
          options: [
            'Koleksi gawai canggih dan pakaian branded',
            'Seseorang yang diberi ilmu Al-Qur\'an lalu mengamalkannya dan orang yang dermawan bersedekah di jalan Allah',
            'Popularitas di media sosial dan jumlah followers',
            'Kecantikan fisik dan gaya hidup mewah'
          ],
          correctOption: 1,
          explanation: 'Rasulullah SAW bersabda: "Tidak boleh hasad (ghibthah) kecuali pada dua hal: orang yang diberi Al-Qur\'an lalu ia mengamalkannya malam dan siang, dan orang yang diberi harta lalu ia infakkan di jalan kebenaran" (HR. Bukhari).'
        },
        {
          timestampSeconds: 435,
          label: 'Checkpoint Manajemen Amarah',
          questionPrompt: 'Langkah pertama yang diperintahkan Rasulullah SAW saat emosi marah mulai mendidih adalah:',
          options: [
            'Membalas kata-kata lawan bicara lebih keras',
            'Membaca ta\'awwudz untuk memohon perlindungan dari setan dan memilih diam',
            'Membanting benda di sekitar untuk melampiaskan stres',
            'Menulis keluh kesah di status media sosial'
          ],
          correctOption: 1,
          explanation: 'Membaca ta\'awwudz menenangkan gejolak amarah yang disulut setan, dan diam mencegah terucapnya kata-kata zalim.'
        }
      ],
      keyTakeaways: [
        'Ikhlas adalah syarat mutlak diterimanya setiap amal ibadah.',
        'Jangan biarkan hasad merusak hubungan persaudaraan sesama teman sekolah.',
        'Orang kuat adalah yang mampu menahan amarahnya saat ia berkesempatan membalas.',
        'Jaga rahasia kebaikan antara dirimu dengan Allah SWT.'
      ]
    },
    pretest: [
      {
        id: 1,
        question: 'Riya\' dikategorikan oleh Rasulullah SAW sebagai bentuk syirik kecil (asy-syirkul ashghar) karena...',
        options: [
          'Pelakunya menyembah berhala batu secara terang-terangan',
          'Pelakunya menduakan niat ibadahnya antara mencari ridha Allah dengan mengharap sanjungan manusia',
          'Hanya dilakukan oleh orang-orang non-muslim',
          'Menggugurkan seluruh iman pelakunya seketika itu juga'
        ],
        correctAnswer: 1,
        explanation: 'Riya\' adalah menyekutukan niat amal kepada selain Allah demi pujian pandangan manusia.',
        dalil: {
          source: 'HR. Ahmad',
          meaning: 'Syirik kecil adalah riya\' dalam beramal ibadah.'
        }
      },
      {
        id: 2,
        question: 'Perbedaan mendasar antara Riya\' dan Sum\'ah terletak pada...',
        options: [
          'Riya\' ingin dilihat mata manusia, sedangkan Sum\'ah ingin didengar telinga manusia',
          'Riya\' bernilai pahala sedangkan Sum\'ah bernilai dosa',
          'Sum\'ah hanya terjadi pada amalan shalat saja',
          'Tidak ada perbedaan sama sekali'
        ],
        correctAnswer: 0,
        explanation: 'Riya\' berasal dari kata ru\'yah (melihat), sedangkan Sum\'ah berasal dari kata sama\' (mendengar).',
        dalil: {
          source: 'Fathul Bari - Ibnu Hajar',
          meaning: 'Riya berkaitan dengan penglihatan mata, sum\'ah berkaitan dengan pendengaran telinga.'
        }
      },
      {
        id: 3,
        question: 'Hadits nabi menyatakan: "Tanda-tanda orang munafik itu ada tiga, yaitu..."',
        options: [
          'Bila berbicara dusta, bila berjanji ingkar, dan bila dipercaya khianat',
          'Bila shalat terlambat, bila puasa batal, dan bila zakat enggan',
          'Bila kaya sombong, bila miskin putus asa, dan bila sakit mengeluh',
          'Bila melihat hasad, bila mendengar riya, bila berbuat ghadhab'
        ],
        correctAnswer: 0,
        explanation: 'Ayatul munafiqi tsalatsun: idza haddatsa kadzaba, wa idza wa\'ada akhlafa, wa idza\'tumina khana (HR. Bukhari & Muslim).',
        dalil: {
          source: 'HR. Bukhari No. 33 & Muslim No. 59',
          meaning: 'Tanda orang munafik ada tiga: jika berbicara ia berdusta, jika berjanji ia ingkar, dan jika diberi amanah ia khianat.'
        }
      },
      {
        id: 4,
        question: 'Perumpamaan bahaya Hasad (dengki) menurut sabda Rasulullah SAW diibaratkan seperti...',
        options: [
          'Air yang memadamkan api',
          'Api yang melahap kayu bakar hingga musnah tak bersisa',
          'Batu karang yang kokoh di tepi laut',
          'Bunga mawar yang berduri'
        ],
        correctAnswer: 1,
        explanation: 'Hasad membakar dan melenyapkan kebaikan-kebaikan yang telah susah payah dikumpulkan.',
        dalil: {
          source: 'HR. Abu Dawud No. 4903',
          meaning: 'Hasad itu memakan kebaikan sebagaimana api memakan kayu bakar.'
        }
      },
      {
        id: 5,
        question: 'Apabila seseorang sedang dilanda rasa amarah (ghadhab) dalam posisi berdiri, sunnah yang dianjurkan nabi adalah...',
        options: [
          'Segera berlari secepat mungkin',
          'Duduk, dan jika belum reda hendaklah berbaring',
          'Meluapkan amarah ke media sosial',
          'Meminum air panas'
        ],
        correctAnswer: 1,
        explanation: 'Rasulullah SAW bersabda: "Jika salah seorang di antara kalian marah dalam keadaan berdiri, maka hendaklah ia duduk..." (HR. Abu Dawud).',
        dalil: {
          source: 'HR. Abu Dawud No. 4782',
          meaning: 'Hendaklah ia duduk, jika amarahnya reda maka baik, namun jika belum hendaklah ia berbaring.'
        }
      }
    ],
    posttest: [
      {
        id: 1,
        question: 'Perhatikan perumpamaan dalam QS. Al-Baqarah: 264. Orang yang berinfak disertai riya\' diumpamakan seperti...',
        options: [
          'Sebuah pohon rindang yang berbuah manis sepanjang masa',
          'Batu licin yang di atasnya ada debu, lalu ditimpa hujan lebat sehingga menjadi bersih licin kembali',
          'Benih yang menumbuhkan tujuh bulir dan setiap bulir berisi seratus biji',
          'Perahu yang berlayar tenang di lautan samudra'
        ],
        correctAnswer: 1,
        explanation: 'Ayat tersebut menjelaskan bahwa pahala sedekah orang yang riya akan musnah laksana debu di atas batu licin yang diterpa hujan lebat.',
        dalil: {
          source: 'QS. Al-Baqarah [2]: 264',
          meaning: 'Perumpamaannya seperti batu licin yang di atasnya ada debu, lalu batu itu ditimpa hujan lebat, maka tinggallah batu itu licin lagi...'
        }
      },
      {
        id: 2,
        question: 'Rizky merasa kesal dan sakit hati karena sahabat sekelasnya terpilih menjadi ketua OSIS dan mendapatkan beasiswa, lalu ia menyebarkan rumor jahat agar beasiswa temannya dicabut. Sikap Rizky merupakan wujud dari...',
        options: ['Ghibthah', 'Hasad', 'Iffah', 'Syaja\'ah'],
        correctAnswer: 1,
        explanation: 'Hasad adalah membenci nikmat orang lain disertai keinginan jahat agar nikmat itu sirna dari orang tersebut.',
        dalil: {
          source: 'HR. Abu Dawud',
          meaning: 'Jauhilah oleh kalian sifat hasad, karena ia menghancurkan pahala kebaikan.'
        }
      },
      {
        id: 3,
        question: 'Mengapa wudhu sangat efektif dalam meredakan amarah (ghadhab) menurut tinjauan syariat?',
        options: [
          'Karena wudhu hanya sekadar membasahi muka dengan air dingin',
          'Karena marah berasal dari setan, setan diciptakan dari api, dan api hanya bisa dipadamkan dengan air',
          'Karena wudhu merupakan syarat sah shalat fardhu saja',
          'Agar orang yang marah merasa mengantuk'
        ],
        correctAnswer: 1,
        explanation: 'Rasulullah SAW bersabda: "Sesungguhnya amarah itu dari setan, dan setan diciptakan dari api, sedang api hanya dipadamkan dengan air, maka jika marah berwudhulah" (HR. Abu Dawud).',
        dalil: {
          source: 'HR. Abu Dawud No. 4784',
          meaning: 'Innal ghadhaba minasy syaithan, wa innasy syaithana khuliqa minan nar...'
        }
      },
      {
        id: 4,
        question: 'Nifaq itiqadi (keyakinan) berbeda dengan nifaq amali (perbuatan), karena nifaq itiqadi...',
        options: [
          'Hanya membuat seseorang lupa waktu salat',
          'Mengeluarkan pelakunya dari lingkaran Islam secara hakiki karena menampakkan iman padahal hatinya kafir',
          'Tidak ada hubungannya dengan keimanan',
          'Bisa dimaafkan tanpa bertaubat'
        ],
        correctAnswer: 1,
        explanation: 'Nifaq itiqadi adalah kemunafikan akidah yang menyebabkan pelakunya berada di kerak neraka paling bawah (ad-darkul asfalu minan nar).',
        dalil: {
          source: 'QS. An-Nisa: 145',
          meaning: 'Sesungguhnya orang-orang munafik itu (ditempatkan) pada tingkatan yang paling bawah dari neraka.'
        }
      },
      {
        id: 5,
        question: 'Sikap yang benar ketika kita melihat orang lain mendapatkan prestasi atau kenikmatan adalah mendoakannya dengan kalimat...',
        options: [
          'Barakallahu laka wa baraka \'alaik / Masya Allah La Quwwata Illa Billah',
          'Na\'udzubillahi min dzalik',
          'Inna lillahi wa inna ilaihi raji\'un',
          'Astagfirullahal \'adzim'
        ],
        correctAnswer: 0,
        explanation: 'Mendoakan keberkahan (tabrik) mencegah penyakit ain dan membersihkan hati dari sifat dengki.',
        dalil: {
          source: 'QS. Al-Kahfi: 39 & Hadis Shahih',
          meaning: 'Mengapa kamu tidak mengucapkan Masya Allah, la quwwata illa billah ketika kamu memasuki kebunmu...'
        }
      }
    ]
  },
  {
    id: 4,
    number: '04',
    title: 'Adab Bermedia Sosial & Berkomunikasi Digital dalam Islam',
    shortTitle: 'Etika Digital & Fiqih Medsos',
    subtitle: 'Prinsip Tabayyun, Menangkal Hoaks, dan Menjauhi Ghibah Siber',
    semester: 2,
    durationMinutes: 45,
    description: 'Menerapkan etika berkomunikasi Qurani (Qaulan Sadida, Qaulan Ma\'rufa, Qaulan Layyina) di dunia maya, membudayakan tabayyun, serta menghindari ghibah dan adu domba digital.',
    colorScheme: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      badge: 'bg-indigo-600',
      accent: 'indigo',
    },
    learningObjectives: [
      'Menganalisis kewajiban Tabayyun dalam menyikapi informasi berdasarkan QS. Al-Hujurat [49]: 6.',
      'Mengidentifikasi larangan ghibah, fitnah, dan tajassus (mencari-cari kesalahan orang lain) di medsos (QS. Al-Hujurat: 12).',
      'Menerapkan 6 prinsip perkataan islami (Qaulan Sadida, Baligha, Ma\'rufa, Karima, Layyina, Maysura) dalam interaksi siber.',
      'Mengembangkan kecerdasan literasi digital islami bagi generasi muda SMA.'
    ],
    dalilUtama: {
      surah: "QS. Al-Hujurat [49]: 6",
      arabic: "يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوْٓا اِنْ جَاۤءَكُمْ فَاسِقٌۢ بِنَبَاٍ فَتَبَيَّنُوْٓا اَنْ تُصِيْبُوْا قَوْمًاۢ بِجَهَالَةٍ فَتُصْبِحُوْا عَلٰى مَا فَعَلْتُمْ نٰدِمِيْنَ",
      transliteration: "Yā ayyuhallażīna āmanū in jā'akum fāsiqum binaba'in fa tabayyanū an tuṣībū qaumam bijahālatin fa tuṣbiḥū 'alā mā fa'altum nādimīn.",
      translation: "Wahai orang-orang yang beriman! Jika seseorang yang fasik datang kepadamu membawa suatu berita, maka telitilah kebenarannya (ber-tabayyun-lah), agar kamu tidak mencelakakan suatu kaum karena kebodohan (kecerobohan), yang akhirnya kamu menyesali perbuatanmu itu."
    },
    ebookPages: [
      {
        pageNumber: 1,
        title: 'Fiqih Tabayyun: Menangkal Hoaks & Berita Dusta di Media Sosial',
        subsections: [
          {
            heading: '1. Kewajiban Tabayyun di Era Banjir Informasi',
            content: [
              'Tabayyun (التَّبَيُّنُ) berarti meneliti, memverifikasi, dan mencari kejelasan suatu kabar secara cermat sebelum mempercayai atau membagikannya.',
              'Di era media sosial saat ini, kabar bohong (hoaks), ujaran kebencian, dan manipulasi informasi menyebar dalam hitungan detik. Jika seorang muslim meneruskan berita tanpa kroscek, ia telah berdosa.',
              'Rasulullah SAW bersabda: "Cukuplah seseorang dianggap berdusta apabila ia menceritakan setiap apa yang ia dengar (tanpa menyaringnya)" (HR. Muslim).'
            ],
            highlightQuote: 'Saring sebelum sharing: Jemarimu di layar kaca akan dimintai pertanggungjawaban di hadapan Mahkamah Ilahi kelak.',
            arabicQuote: {
              text: 'كَفَى بِالْمَرْءِ كَذِبًا أَنْ يُحَدِّثَ بِكُلِّ مَا سَمِعَ',
              source: 'HR. Muslim',
              meaning: 'Cukuplah seseorang dikatakan berdusta jika ia menceritakan segala yang didengarnya.'
            }
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Enam Kaidah Komunikasi Qurani (Al-Aqwal As-Sittah)',
        subsections: [
          {
            heading: '1. Prinsip Berkomunikasi Santun di Ruang Siber',
            content: [
              '1. Qaulan Sadīdan (QS. An-Nisa: 9): Perkataan yang benar, jujur, faktual, dan tidak manipulatif.',
              '2. Qaulan Ma\'rūfan (QS. Al-Ahzab: 32): Perkataan yang baik, santun, dan sesuai norma kesopanan masyarakat.',
              '3. Qaulan Balīghan (QS. An-Nisa: 63): Perkataan yang efektif, komunikatif, dan menyentuh nurani.',
              '4. Qaulan Karīman (QS. Al-Isra: 23): Perkataan yang mulia, penuh penghormatan dan penghargaan.',
              '5. Qaulan Layyinan (QS. Thaha: 44): Perkataan yang lemah lembut, tidak kasar dan tidak memprovokasi.',
              '6. Qaulan Maysūran (QS. Al-Isra: 28): Perkataan yang mudah dicerna, menenangkan, dan optimis.'
            ]
          }
        ]
      }
    ],
    pdfContent: {
      moduleTitle: 'MODUL ADAB BERMEDIA SOSIAL DAN ETIKA DIGITAL - KELAS 11 SMA',
      author: 'Tim MGMP PAI SMA Kurikulum Merdeka',
      schoolLevel: 'SMA / MA Kelas XI - Fase F',
      totalStudyHours: '3 Jam Pelajaran (3 x 45 Menit)',
      summaryPoints: [
        'Tabayyun adalah kewajiban mutlak sebelum me-repost atau mempercayai kabar di media sosial.',
        'Ghibah dan namimah di ruang siber (komentar julid, spill aib) dosanya setara memakan bangkai saudara sendiri.',
        'Tajassus (stalking mencari kesalahan orang lain) dilarang keras dalam QS. Al-Hujurat: 12.',
        'Medsos harus menjadi ladang dakwah, syiar ilmu, dan silaturahmi yang mendatangkan pahala jariyah.'
      ],
      caseStudies: [
        {
          caseTitle: 'Studi Kasus: Menyebarkan Tangkapan Layar Obrolan Pribadi (Spill Chat)',
          story: 'Dua orang siswi berselisih paham di grup WhatsApp. Salah satu siswi mengunggah tangkapan layar chat pribadi temannya ke media sosial hingga viral dan temannya dirundung warganet se-Indonesia.',
          discussionQuestions: [
            'Bagaimana tinjauan hukum Islam mengenai membuka aib pribadi orang lain di media sosial?',
            'Apa dampak hukum ITE dan psikologis yang dihadapi korban perundungan siber tersebut?',
            'Bagaimana solusi islami untuk menyelesaikan perselisihan tanpa mengumbar ke publik?'
          ]
        }
      ]
    },
    videoTutorial: {
      title: 'Video Pembelajaran: Etika Digital & Fiqih Bermedia Sosial Pelajar Muslim',
      youtubeId: 'F2vLw8v9Kz0',
      durationSeconds: 630,
      description: 'Panduan bermedia sosial bagi Gen-Z SMA: teknik tabayyun melawan hoaks, adab berkomentar santun, dan menghindari ghibah digital.',
      chaptersList: [
        { time: '00:00', seconds: 0, title: 'Realita Kehidupan Remaja di Era Algoritma' },
        { time: '01:40', seconds: 100, title: 'Tafsir QS. Al-Hujurat: 6 & Konsep Kroscek Tabayyun' },
        { time: '03:45', seconds: 225, title: 'Larangan Ghibah & Tajassus Digital (QS. Al-Hujurat: 12)' },
        { time: '05:40', seconds: 340, title: 'Checkpoint: Kuis Etika Berbagi Konten' },
        { time: '07:20', seconds: 440, title: '6 Prinsip Komunikasi Qurani dalam Chatting' },
        { time: '09:20', seconds: 560, title: 'Resolusi Medsos Sehat & Penuh Berkah' }
      ],
      checkpoints: [
        {
          timestampSeconds: 340,
          label: 'Checkpoint Kaidah Tabayyun',
          questionPrompt: 'Langkah pertama yang wajib dilakukan saat menerima pesan berantai yang menghebohkan di grup WhatsApp sekolah adalah:',
          options: [
            'Langsung membagikan ke seluruh kontak agar menjadi orang pertama yang mengabarkan',
            'Melakukan tabayyun (verifikasi sumber resmi) dan menahan diri untuk tidak membagikannya jika belum terbukti sahih',
            'Menambahkan opini pribadi agar ceritanya lebih menarik',
            'Menghakimi pihak yang diberitakan secara sepihak'
          ],
          correctOption: 1,
          explanation: 'Tabayyun menghindarkan kita dari menuduh pihak lain secara ceroboh yang berujung penyesalan mendalam.'
        },
        {
          timestampSeconds: 440,
          label: 'Checkpoint Komunikasi Qurani',
          questionPrompt: 'Prinsip perkataan yang benar, jujur, tanpa manipulasi dan tipu daya dalam Al-Qur\'an diistilahkan dengan:',
          options: [
            'Qaulan Layyina',
            'Qaulan Sadida',
            'Qaulan Maysura',
            'Qaulan Karima'
          ],
          correctOption: 1,
          explanation: 'Qaulan Sadīdan adalah perkataan yang lurus, jujur, dan benar sesuai kenyataan.'
        }
      ],
      keyTakeaways: [
        'Setiap postingan, likes, dan komentar meninggalkan jejak digital yang dicatat oleh Malaikat Raqib dan Atid.',
        'Hindari budaya "spill aib" karena menutup aib sesama muslim adalah perbuatan yang mendatangkan perlindungan Allah di akhirat.',
        'Gunakan gawai dan medsos untuk menebar inspirasi, karya kreatif, dan kebaikan dakwah.'
      ]
    },
    pretest: [
      {
        id: 1,
        question: 'Perintah untuk melakukan "Tabayyun" saat menerima kabar dari orang yang fasik tercantum dalam Al-Qur\'an surat...',
        options: [
          'QS. Al-Hujurat [49]: 6',
          'QS. Al-Baqarah [2]: 183',
          'QS. An-Nur [24]: 2',
          'QS. Al-Ma\'un [107]: 1'
        ],
        correctAnswer: 0,
        explanation: 'QS. Al-Hujurat ayat 6 memerintahkan orang-orang beriman untuk meneliti berita dari orang fasik agar tidak mencelakakan kaum lain.',
        dalil: {
          source: 'QS. Al-Hujurat [49]: 6',
          meaning: 'Wahai orang-orang yang beriman! Jika seseorang yang fasik datang kepadamu membawa suatu berita, maka telitilah kebenarannya...'
        }
      },
      {
        id: 2,
        question: 'Tindakan mencari-cari kesalahan, keburukan, atau privasi orang lain (istilah gaulnya: stalking aib orang) dalam Islam disebut...',
        options: ['Ghibah', 'Tajassus', 'Namimah', 'Buhtan'],
        correctAnswer: 1,
        explanation: 'Tajassus (التَّجَسُّسُ) adalah memata-matai atau mencari-cari kesalahan dan kejelekan orang lain yang dilarang tegas dalam QS. Al-Hujurat: 12.',
        dalil: {
          source: 'QS. Al-Hujurat: 12',
          meaning: '...dan janganlah kamu mencari-cari kesalahan orang lain (wa la tajassasu)...'
        }
      },
      {
        id: 3,
        question: 'Perumpamaan orang yang melakukan ghibah (membicarakan keburukan orang lain) dalam QS. Al-Hujurat: 12 diserupakan dengan...',
        options: [
          'Meminum racun yang mematikan',
          'Memakan daging bangkai saudaranya sendiri yang telah mati',
          'Membakar rumah tetangganya sendiri',
          'Menenggelamkan perahu di tengah badai'
        ],
        correctAnswer: 1,
        explanation: 'Al-Qur\'an menegaskan: "Sukakah salah seorang di antara kamu memakan daging saudaranya yang sudah mati? Tentu kamu merasa jijik kepadanya".',
        dalil: {
          source: 'QS. Al-Hujurat [49]: 12',
          meaning: 'Ayuḥibbu aḥadukum ay ya\'kula laḥma akhīhi maitan fakarihtumūh.'
        }
      },
      {
        id: 4,
        question: 'Prinsip "Qaulan Layyinan" yang diperintahkan Allah kepada Nabi Musa dan Harun saat menghadapi Fir\'aun mengandung arti berbicara dengan...',
        options: [
          'Nada berteriak penuh ancaman',
          'Kata-kata yang lemah lembut dan tidak memicu kebencian',
          'Bahasa asing yang sulit dipahami',
          'Candaan yang berlebihan'
        ],
        correctAnswer: 1,
        explanation: 'Qaulan Layyina berarti perkataan yang lembut, santun, dan penuh kasih sayang.',
        dalil: {
          source: 'QS. Thaha: 44',
          meaning: 'Maka berbicaralah kamu berdua kepadanya (Fir\'aun) dengan kata-kata yang lemah lembut...'
        }
      },
      {
        id: 5,
        question: 'Dosa menyebarkan kabar bohong yang tidak pernah dilakukan oleh pihak tertuduh sama sekali (fitnah dusta) dalam bahasa Arab disebut...',
        options: ['Ghibah', 'Buhtān', 'Nifaq', 'Kadzib biasa'],
        correctAnswer: 1,
        explanation: 'Jika keburukan itu ada pada saudaramu maka itu ghibah, tetapi jika keburukan itu tidak ada padanya maka engkau telah melakukan buhtān (fitnah besar).',
        dalil: {
          source: 'HR. Muslim No. 2589',
          meaning: 'Wa in lam yakun fihi ma taqulu faqad bahattahu (Jika tidak ada padanya apa yang engkau katakan, maka engkau telah menuduhnya dusta/buhtan).'
        }
      }
    ],
    posttest: [
      {
        id: 1,
        question: 'Mengapa menyebarkan informasi tanpa melakukan verifikasi terlebih dahulu dapat menyeret pelakunya ke dalam kategori pendusta menurut hadis nabi?',
        options: [
          'Karena sebagian besar kabar yang beredar tanpa verifikasi mengandung distorsi, fitnah, dan kebohongan',
          'Karena internet adalah hal yang diharamkan',
          'Hanya jika informasi itu mengenai urusan politik saja',
          'Karena wartawan melarang masyarakat umum berbagi berita'
        ],
        correctAnswer: 0,
        explanation: 'Orang yang membagikan segala yang ia dengar tanpa menyaring akan menjadi perpanjangan tangan dusta dan kezaliman di tengah masyarakat.',
        dalil: {
          source: 'HR. Muslim',
          meaning: 'Cukuplah seseorang dianggap berdusta bila ia menyampaikan setiap apa yang ia dengar.'
        }
      },
      {
        id: 2,
        question: 'Sebuah akun anonim di X/Twitter membuat utas (thread) membongkar aib masa lalu seorang guru demi menaikkan followers. Ditinjau dari sudut pandang akhlak Islam, tindakan tersebut...',
        options: [
          'Sangat baik sebagai bentuk kebebasan berekspresi',
          'Haram karena membuka aib (ghibah/buhtan) dan menyebarkan keburukan di tengah publik',
          'Mubah selama tidak ada yang menuntut secara hukum perdata',
          'Sunnah untuk memberi efek jera'
        ],
        correctAnswer: 1,
        explanation: 'Membongkar aib pribadi orang lain di muka umum adalah kemaksiatan lisan dan jariyah keburukan.',
        dalil: {
          source: 'HR. Muslim',
          meaning: 'Barangsiapa menutupi aib seorang muslim, Allah akan menutupi aibnya di dunia dan akhirat.'
        }
      },
      {
        id: 3,
        question: 'Ketika seorang siswa muslim menulis komentar di forum diskusi online untuk mengoreksi pendapat temannya, ia hendaknya menggunakan prinsip Qaulan Ma\'rufan dan Qaulan Sadidan, yang berarti...',
        options: [
          'Menggunakan kata-kata kasar agar temannya segera paham',
          'Menyampaikan kritik dengan argumentasi yang benar, santun, dan menghargai martabat sesama',
          'Menyerang kepribadian pribadi temannya secara langsung',
          'Membuat meme ejekan untuk mempermalukan'
        ],
        correctAnswer: 1,
        explanation: 'Qaulan Sadidan (benar dan tepat) dipadukan dengan Qaulan Ma\'rufan (santun dan baik) adalah standar emas komunikasi islami.',
        dalil: {
          source: 'QS. Al-Ahzab: 70',
          meaning: 'Wahai orang-orang yang beriman! Bertakwalah kamu kepada Allah dan ucapkanlah perkataan yang benar.'
        }
      },
      {
        id: 4,
        question: 'Dampak buruk fenomena adu domba (namimah) di grup chat media sosial sekolah adalah...',
        options: [
          'Membuat kelompok belajar semakin kompak',
          'Merusak tali persaudaraan (ukhuwah), memicu permusuhan antar kelas, dan pelakunya diancam tidak masuk surga',
          'Meningkatkan keterampilan menulis siswa',
          'Mendatangkan pahala jika diselingi humor'
        ],
        correctAnswer: 1,
        explanation: 'Rasulullah SAW bersabda: "La yadkhulul jannata nammam" (Tidak akan masuk surga orang yang suka mengadu domba/menebar namimah - HR. Bukhari Muslim).',
        dalil: {
          source: 'HR. Bukhari & Muslim',
          meaning: 'Tidak akan masuk surga orang yang suka mengadu domba.'
        }
      },
      {
        id: 5,
        question: 'Langkah preventif terbaik bagi pelajar muslim agar waktu tidak tersita sia-sia dalam scrolling medsos yang tidak bermanfaat adalah menerapkan prinsip...',
        options: [
          'Tarku ma la ya\'nihi (meninggalkan hal yang tidak bermanfaat demi menyempurnakan keislaman)',
          'Menonton seluruh siaran langsung seharian',
          'Mengabaikan tugas sekolah demi konten viral',
          'Menghapus seluruh akun pertemanan'
        ],
        correctAnswer: 0,
        explanation: 'Min husni islamil mar\'i tarkuhu ma la ya\'nihi (Di antara tanda kebaikan Islam seseorang adalah meninggalkan hal yang tidak bermanfaat baginya - HR. Tirmidzi).',
        dalil: {
          source: 'HR. At-Tirmidzi No. 2317',
          meaning: 'Sebagian dari tanda kebaikan keislaman seseorang ialah ia meninggalkan apa yang tidak berguna baginya.'
        }
      }
    ]
  },
  {
    id: 5,
    number: '05',
    title: 'Hormat dan Patuh kepada Orang Tua (Birrul Walidain) dan Guru',
    shortTitle: 'Bakti Orang Tua & Takzim Guru',
    subtitle: 'Kunci Keberkahan Hidup, Kesuksesan Ilmu, dan Ridha Ilahi',
    semester: 2,
    durationMinutes: 45,
    description: 'Meneladani keutamaan Birrul Walidain (berbakti kepada orang tua) saat masih hidup maupun sesudah wafat, serta mengamalkan adab takzim dan tawadhu kepada guru sebagai pewaris para nabi.',
    colorScheme: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      badge: 'bg-teal-600',
      accent: 'teal',
    },
    learningObjectives: [
      'Menganalisis kewajiban berbakti kepada orang tua berdasarkan QS. Al-Isra\' [17]: 23-24 dan QS. Luqman [31]: 14.',
      'Menjelaskan korelasi antara ridha orang tua dengan ridha Allah SWT sesuai hadis nabi.',
      'Mengidentifikasi adab-adab mulia terhadap guru yang mendatangkan keberkahan ilmu.',
      'Menerapkan amalan bakti kepada orang tua dan guru yang telah meninggal dunia.'
    ],
    dalilUtama: {
      surah: "QS. Al-Isra' [17]: 23",
      arabic: "وَقَضٰى رَبُّكَ اَلَّا تَعْبُدُوْٓا اِلَّآ اِيَّاهُ وَبِالْوَالِدَيْنِ اِحْسٰنًا ۗ اِمَّا يَبْلُغَنَّ عِنْدَكَ الْكِبَرَ اَحَدُهُمَآ اَوْ كِلٰهُمَا فَلَا تَقُلْ لَّهُمَآ اُفٍّ وَّلَا تَنْهَرْهُمَا وَقُلْ لَّهُمَا قَوْلًا كَرِيْمًا",
      transliteration: "Wa qaḍā rabbuka allā ta'budū illā iyyāhu wa bil-wālidaini iḥsānā, immā yabluġanna 'indakal-kibara aḥaduhumā au kilāhumā falā taqul lahumā uffiw wa lā tanhar-humā wa qul lahumā qaulan karīmā.",
      translation: "Dan Tuhanmu telah memerintahkan agar kamu jangan menyembah selain Dia dan hendaklah berbuat baik kepada ibu bapak. Jika salah seorang di antara keduanya atau kedua-duanya sampai berusia lanjut dalam pemeliharaanmu, maka sekali-kali janganlah engkau mengatakan kepada keduanya perkataan 'ah' dan janganlah engkau membentak keduanya, dan ucapkanlah kepada keduanya perkataan yang mulia."
    },
    ebookPages: [
      {
        pageNumber: 1,
        title: 'Keagungan Birrul Walidain: Pintu Surga Paling Tengah',
        subsections: [
          {
            heading: '1. Perintah Gandeng: Tauhid dan Berbakti',
            content: [
              'Dalam banyak ayat Al-Qur\'an, Allah menggandengkan perintah mentauhidkan-Nya dengan perintah berbakti kepada kedua orang tua (Ihsan bil walidain). Ini menunjukkan betapa agungnya kedudukan orang tua di sisi Allah SWT.',
              'Bahkan mengucapkan kata "Uff" (ah/cih) saja diharamkan, apalagi membentak atau menolak nasihat mereka dengan kasar.',
              'Rasulullah SAW bersabda: "Ridha Allah bergantung pada ridha kedua orang tua, dan murka Allah bergantung pada murka kedua orang tua" (HR. Tirmidzi).'
            ],
            highlightQuote: 'Ibumu mengandungmu dalam kepayahan yang bertambah-tambah, dan menyapihmu dalam dua tahun. Berterima-kasihlah kepada Allah dan kepada kedua orang tuamu.',
            arabicQuote: {
              text: 'رِضَا الرَّبِّ فِي رِضَا الْوَالِدَيْنِ، وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدَيْنِ',
              source: 'HR. At-Tirmidzi',
              meaning: 'Ridha Allah ada pada ridha kedua orang tua, dan murka Allah ada pada murka kedua orang tua.'
            }
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Adab Takzim kepada Guru: Pewaris Para Nabi',
        subsections: [
          {
            heading: '1. Mengapa Kita Wajib Memuliakan Guru?',
            content: [
              'Jika orang tua adalah sebab kelahiran fisik kita ke dunia, maka guru adalah pembimbing rohani dan akal kita menuju jalan keselamatan akhirat.',
              'Imam Syafi\'i menceritakan adabnya di hadapan Imam Malik: "Aku membalikkan lembaran kertas di depan Imam Malik dengan sangat perlahan agar beliau tidak terganggu oleh bunyi desiran kertas tersebut."',
              'Para ulama menegaskan: Keberkahan dan kemanfaatan ilmu seorang penuntut ilmu sangat bergantung pada rasa hormat dan ridha gurunya.'
            ],
            practicalTips: [
              'Mengucapkan salam dan mencium tangan guru dengan takzim saat bertemu.',
              'Mendengarkan penjelasan guru di kelas dengan penuh perhatian, tidak menyela atau bermain gawai.',
              'Mendoakan kebaikan, kesehatan, dan ampunan bagi bapak/ibu guru dalam setiap shalat.',
              'Bersikap rendah hati (tawadhu\') meskipun kelak ilmu dan kedudukan kita lebih tinggi.'
            ]
          }
        ]
      }
    ],
    pdfContent: {
      moduleTitle: 'MODUL BIRRUL WALIDAIN DAN ADAB TERHADAP GURU - KELAS 11 SMA',
      author: 'Tim MGMP PAI SMA Kurikulum Merdeka',
      schoolLevel: 'SMA / MA Kelas XI - Fase F',
      totalStudyHours: '3 Jam Pelajaran (3 x 45 Menit)',
      summaryPoints: [
        'Birrul Walidain menempati posisi tertinggi setelah ibadah shalat tepat pada waktunya.',
        'Durhaka kepada orang tua (Uququl Walidain) adalah dosa besar yang balasannya disegerakan di dunia sebelum akhirat.',
        'Guru adalah orang tua spiritual yang membuka gerbang mata hati dan peradaban.',
        'Bakti kepada orang tua yang wafat: mendoakan ampunan, menunaikan wasiat, menyambung silaturahmi sahabat mereka, dan bersedekah atas nama mereka.'
      ],
      caseStudies: [
        {
          caseTitle: 'Studi Kasus: Perbedaan Pilihan Cita-Cita dengan Orang Tua',
          story: 'Fauzan ingin melanjutkan kuliah di jurusan Desain Komunikasi Visual, namun ayahnya menginginkannya masuk jurusan Ekonomi Akuntansi. Suasana rumah menjadi tegang dan Fauzan mulai mendiamkan ayahnya.',
          discussionQuestions: [
            'Bagaimana cara Fauzan bermusyawarah dengan ayahnya dengan tetap mengedepankan adab Qaulan Karima?',
            'Apakah menolak keinginan orang tua otomatis dianggap durhaka?',
            'Langkah apa yang dapat ditempuh agar kedua pihak menemukan titik temu tanpa melukai perasaan orang tua?'
          ]
        }
      ]
    },
    videoTutorial: {
      title: 'Video Pembelajaran: Dahsyatnya Doa Ibu & Keberkahan Menghormati Guru',
      youtubeId: 'q5zF_a7M9s8',
      durationSeconds: 610,
      description: 'Meneladani kisah Uwais Al-Qarni, makna Birrul Walidain, serta adab mulia kepada bapak/ibu guru yang mengantarkan kesuksesan dunia akhirat.',
      chaptersList: [
        { time: '00:00', seconds: 0, title: 'Ibu & Ayah: Pahlawan Tanpa Tanda Jasa dalam Hidup Kita' },
        { time: '01:50', seconds: 110, title: 'Tafsir QS. Al-Isra\': 23-24 & Larangan Berkata "Ah"' },
        { time: '03:40', seconds: 220, title: 'Kisah Bakti Uwais Al-Qarni yang Mengguncang Langit' },
        { time: '05:30', seconds: 330, title: 'Checkpoint: Kuis Uji Pemahaman Bakti' },
        { time: '07:15', seconds: 435, title: 'Adab Takzim Menuntut Ilmu kepada Guru' },
        { time: '09:10', seconds: 550, title: 'Doa Khusus Kedua Orang Tua & Guru' }
      ],
      checkpoints: [
        {
          timestampSeconds: 330,
          label: 'Checkpoint Hak Orang Tua',
          questionPrompt: 'Saat seorang sahabat bertanya kepada Rasulullah SAW mengenai siapakah orang yang paling berhak mendapatkan perlakuan baik, Rasulullah menjawab:',
          options: [
            'Ayahmu, lalu Ibumu, lalu Gurumu',
            'Ibumu, Ibumu, Ibumu, kemudian Ayahmu',
            'Sahabat terdekatmu',
            'Pemimpin negerimu'
          ],
          correctOption: 1,
          explanation: 'Rasulullah SAW menyebut "Ibumu" sebanyak tiga kali berturut-turut sebelum menyebut "Ayahmu" karena perjuangan mengandung, melahirkan, dan menyusui.'
        },
        {
          timestampSeconds: 435,
          label: 'Checkpoint Keberkahan Guru',
          questionPrompt: 'Sikap murid yang paling mencerminkan adab tawadhu di depan guru saat kegiatan belajar di kelas adalah:',
          options: [
            'Mendengarkan dengan seksama dan mencatat hal-hal penting tanpa menyela pembicaraan guru secara tidak sopan',
            'Bermain gawai sambil sesekali mengangguk',
            'Berbicara sendiri dengan teman sebangku',
            'Meninggalkan kelas tanpa izin'
          ],
          correctOption: 0,
          explanation: 'Mendengarkan dengan penuh perhatian dan meminta izin saat hendak bertanya adalah rukun adab penuntut ilmu yang mendatangkan kemanfaatan ilmu.'
        }
      ],
      keyTakeaways: [
        'Kesuksesan dan kebahagiaan hidup tidak akan pernah tercapai tanpa restu dan doa tulus kedua orang tua.',
        'Jangan pernah menyakiti hati bapak ibu guru, karena ridha guru adalah pembuka jalan terang kemudahan menyerap ilmu pengetahuan.',
        'Bakti tidak terputus meski orang tua atau guru telah berpulang ke rahmatullah.'
      ]
    },
    pretest: [
      {
        id: 1,
        question: 'Dalam QS. Al-Isra\' [17]: 23, perkataan paling minimal yang dilarang keras diucapkan seorang anak kepada orang tuanya saat mereka berusia lanjut adalah...',
        options: ['Kata dusta', 'Perkataan "Ah" (Uff)', 'Panggilan nama tanpa gelar', 'Permintaan uang jajan'],
        correctAnswer: 1,
        explanation: 'Ayat menyatakan: "Fa lā taqul lahumā uffin" (Maka sekali-kali janganlah engkau mengatakan kepada keduanya perkataan ah).',
        dalil: {
          source: "QS. Al-Isra': 23",
          meaning: "Sekali-kali janganlah kamu mengatakan kepada keduanya perkataan ah dan janganlah kamu membentak mereka."
        }
      },
      {
        id: 2,
        question: 'Hadits nabi menegaskan bahwa ridha Allah SWT bergantung pada...',
        options: [
          'Banyaknya harta sedekah yang dikeluarkan',
          'Ridha kedua orang tua',
          'Tingginya gelar akademis yang diraih',
          'Pujian dari masyarakat luas'
        ],
        correctAnswer: 1,
        explanation: 'Ridhar-Rabbi fi ridhal walidain, wa sakhatur-Rabbi fi sakhatil walidain (HR. Tirmidzi).',
        dalil: {
          source: 'HR. At-Tirmidzi No. 1899',
          meaning: 'Ridha Tuhan berada pada ridha orang tua, dan murka Tuhan berada pada murka orang tua.'
        }
      },
      {
        id: 3,
        question: 'Mengapa Rasulullah SAW menyebut sosok "Ibu" sebanyak tiga kali berturut-turut sebelum menyebut "Ayah" dalam hadits mu\'asyarah?',
        options: [
          'Hanya kebetulan urutan kata',
          'Karena ibu menanggung tiga kepayahan berat yang tidak dialami ayah: mengandung, melahirkan, dan menyusui',
          'Karena ayah tidak memiliki kewajiban mendidik anak',
          'Agar anak tidak perlu berbakti kepada ayah'
        ],
        correctAnswer: 1,
        explanation: 'Ibu memikul tiga kesulitan fitrah: kepayahan saat mengandung, sakit saat melahirkan, dan kelelahan saat menyapih/menyusui.',
        dalil: {
          source: 'Syarah Shahih Bukhari',
          meaning: 'Pengutamaan hak ibu karena kekhususan kepayahan kehamilan, persalinan, dan penyusuan.'
        }
      },
      {
        id: 4,
        question: 'Dosa durhaka kepada orang tua dalam istilah syariat Islam dikenal dengan sebutan...',
        options: ['Su\'udzan', '\'Uququl Walidain', 'Qath\'ur Rahim', 'Namimah'],
        correctAnswer: 1,
        explanation: '\'Uququl Walidain (عُقُوْقُ الوَالِدَيْنِ) adalah durhaka kepada orang tua yang merupakan salah satu dosa besar terbesar (akbarul kaba\'ir).',
        dalil: {
          source: 'HR. Bukhari No. 5977',
          meaning: 'Maukah kalian aku beritahukan tentang dosa besar yang paling besar? Syirik kepada Allah dan durhaka kepada orang tua (\'uququl walidain).'
        }
      },
      {
        id: 5,
        question: 'Adab yang benar seorang siswa terhadap gurunya menurut nasihat para ulama salaf adalah...',
        options: [
          'Menganggap guru sebagai rekan kerja biasa tanpa perlu penghormatan',
          'Merendahkan hati (tawadhu\'), mendoakan kebaikan guru, dan tidak membantah dengan arogansi',
          'Hanya menghormati guru jika diberi nilai tinggi',
          'Menolak nasihat guru di depan teman sekelas'
        ],
        correctAnswer: 1,
        explanation: 'Tawadhu dan takzim kepada guru adalah kunci terbukanya hikmah dan keberkahan pemahaman ilmu.',
        dalil: {
          source: 'Kitab Ta\'limul Muta\'allim',
          meaning: 'Seseorang tidak akan memperoleh ilmu dan kemanfaatannya kecuali dengan memuliakan ilmu dan ahli ilmu (guru).'
        }
      }
    ],
    posttest: [
      {
        id: 1,
        question: 'Bagaimanakah cara seorang anak berbakti (Birrul Walidain) kepada kedua orang tuanya yang telah meninggal dunia?',
        options: [
          'Cukup dengan meratapi kepergian mereka setiap hari',
          'Mendoakan ampunan bagi mereka, menunaikan wasiat dan janji mereka, menyambung silaturahmi dengan kerabat/sahabat mereka, dan bersedekah atas nama mereka',
          'Membangun makam megah dengan hiasan marmer emas',
          'Menghentikan seluruh aktivitas sosial'
        ],
        correctAnswer: 1,
        explanation: 'Rasulullah SAW mengajarkan seorang sahabat dari Bani Salamah cara berbakti setelah orang tua wafat: mendoakan, memohonkan ampunan, menunaikan janji/wasiat, dan menyambung tali silaturahmi kerabat mereka.',
        dalil: {
          source: 'HR. Abu Dawud No. 5142',
          meaning: 'Mendoakan keduanya, memohonkan ampunan, menyempurnakan janji mereka, memuliakan teman mereka, dan menyambung silaturahmi...'
        }
      },
      {
        id: 2,
        question: 'Perhatikan firman Allah dalam QS. Luqman [31]: 15. Apabila kedua orang tua memaksa seorang anak untuk berbuat syirik atau kemaksiatan, sikap anak yang benar adalah...',
        options: [
          'Mematuhi ajakan maksiat tersebut demi membahagiakan orang tua',
          'Tidak mematuhi ajakan syirik/maksiat tersebut, namun tetap memperlakukan keduanya di dunia dengan cara yang baik dan penuh kelembutan',
          'Memutus tali silaturahmi dan mencaci maki orang tua',
          'Memusuhi keluarga besar selamanya'
        ],
        correctAnswer: 1,
        explanation: 'Tidak ada ketaatan kepada makhluk dalam bermaksiat kepada Sang Khalik, namun Al-Qur\'an memerintahkan tetap bergaul dengan mereka di dunia secara ma\'ruf (baik).',
        dalil: {
          source: 'QS. Luqman [31]: 15',
          meaning: 'Dan jika keduanya memaksamu untuk mempersekutukan dengan Aku sesuatu yang tidak ada pengetahuanmu tentang itu, maka janganlah kamu mengikuti keduanya, dan pergaulilah keduanya di dunia dengan baik.'
        }
      },
      {
        id: 3,
        question: 'Kisah sahabat Nabi SAW dari Yaman yang dipuji oleh Rasulullah sebagai pemuda yang doanya mustajab dan sangat berbakti merawat ibunya yang lumpuh adalah...',
        options: ['Salman Al-Farisi', 'Uwais Al-Qarni', 'Mush\'ab bin Umair', 'Abu Hurairah'],
        correctAnswer: 1,
        explanation: 'Uwais Al-Qarni dipuji Rasulullah SAW di hadapan Umar bin Khattab dan Ali bin Abi Thalib karena baktinya yang luar biasa kepada sang ibu.',
        dalil: {
          source: 'Shahih Muslim No. 2542',
          meaning: 'Dia memiliki seorang ibu dan dia sangat berbakti kepadanya; seandainya dia bersumpah kepada Allah, niscaya Allah akan mengabulkannya.'
        }
      },
      {
        id: 4,
        question: 'Ketika seorang guru sedang menerangkan materi di depan kelas, manakah tindakan yang paling melanggar adab kesopanan penuntut ilmu?',
        options: [
          'Mencatat ringkasan penjelasan di buku tulis',
          'Membuka gawai untuk chatting bermain game dan berbicara sendiri dengan teman sebangku',
          'Mengacungkan tangan terlebih dahulu sebelum bertanya',
          'Memperhatikan kontak mata dengan guru'
        ],
        correctAnswer: 1,
        explanation: 'Tidak menyimak dan menyibukkan diri dengan aktivitas lain di depan guru menunjukkan ketiadaan takzim terhadap majelis ilmu.',
        dalil: {
          source: 'Tadzkiratus Sami\' wal Mutakallim',
          meaning: 'Di antara adab murid adalah menghadapkan wajah dan konsentrasinya kepada guru saat beliau mengajar.'
        }
      },
      {
        id: 5,
        question: 'Di antara balasan kontan di dunia yang dijanjikan Allah bagi anak yang senantiasa berbakti kepada orang tuanya (Birrul Walidain) menurut hadis shahih adalah...',
        options: [
          'Dilapangkan rezekinya dan dipanjangkan umurnya dalam keberkahan',
          'Terbebas dari seluruh penyakit fisik selamanya',
          'Pasti menjadi pejabat tinggi negara',
          'Tidak perlu belajar keras untuk ujian'
        ],
        correctAnswer: 0,
        explanation: 'Rasulullah SAW bersabda: "Barangsiapa yang ingin dipanjangkan usianya dan ditambahkan rezekinya, maka hendaklah ia berbakti kepada kedua orang tuanya dan menyambung silaturahmi" (HR. Ahmad).',
        dalil: {
          source: 'HR. Ahmad & Al-Hakim',
          meaning: 'Barangsiapa berbakti kepada kedua orang tuanya maka keberuntungan baginya dan Allah akan menambah umurnya.'
        }
      }
    ]
  }
];
