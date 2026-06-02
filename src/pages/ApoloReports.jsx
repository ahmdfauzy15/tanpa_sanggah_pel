import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Filter, 
  Download, 
  Search, 
  FileText, 
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Calendar,
  AlertCircle,
  Eye,
  RefreshCw,
  Building,
  FileCheck,
  AlertTriangle,
  CalendarCheck,
  CalendarDays,
  ClockAlert,
  Calendar as CalendarIcon,
  Clock4,
  CheckSquare,
  Hourglass,
  AlertOctagon,
  Upload,
  Edit,
  MessageSquare,
  Check,
  X,
  FileUp,
  Trash2,
  ChevronUp,
  Send,
  Info,
  FileWarning,
  ClipboardList
} from 'lucide-react';

// Daftar nama form laporan
const FORM_LIST = [
  { no: 1, namaForm: "Form Laporan Rencana Bisnis Bank", kodeForm: "FRBB-01", jenis: "Tahunan" },
  { no: 2, namaForm: "Form Laporan Rutin Bulanan", kodeForm: "FLRB-02", jenis: "Bulanan" },
  // { no: 3, namaForm: "Form Laporan Keuangan Konsolidasi", kodeForm: "FLKK-03", jenis: "Tahunan" },
  // { no: 4, namaForm: "Form Laporan GWM Individual", kodeForm: "FGWM-04", jenis: "Bulanan" },
  // { no: 5, namaForm: "Form Laporan Risiko Likuiditas", kodeForm: "FLRL-05", jenis: "Bulanan" },
  // { no: 6, namaForm: "Form Laporan GWM Konsolidasi", kodeForm: "FGWM-06", jenis: "Bulanan" },
  // { no: 7, namaForm: "Form Laporan Posisi Devisa Neto", kodeForm: "FLPD-07", jenis: "Harian" },
  // { no: 8, namaForm: "Form Laporan Kewajiban Penyediaan Modal Minimum", kodeForm: "FLKP-08", jenis: "Triwulan" },
];

// Custom Date Input DD/MM/YYYY dengan calendar picker
const DateInputDDMMYYYY = ({ value, onChange, label, required, placeholder = "DD/MM/YYYY" }) => {
  const inputRef = useRef(null);
  const hiddenRef = useRef(null);

  const toISO = (ddmmyyyy) => {
    if (!ddmmyyyy || ddmmyyyy.length !== 10) return '';
    const [dd, mm, yyyy] = ddmmyyyy.split('/');
    if (!dd || !mm || !yyyy) return '';
    return `${yyyy}-${mm}-${dd}`;
  };

  const fromISO = (iso) => {
    if (!iso || iso.length !== 10) return '';
    const [yyyy, mm, dd] = iso.split('-');
    return `${dd}/${mm}/${yyyy}`;
  };

  const handleTextChange = (e) => {
    let raw = e.target.value.replace(/[^0-9]/g, '');
    let formatted = '';
    if (raw.length <= 2) {
      formatted = raw;
    } else if (raw.length <= 4) {
      formatted = raw.slice(0, 2) + '/' + raw.slice(2);
    } else {
      formatted = raw.slice(0, 2) + '/' + raw.slice(2, 4) + '/' + raw.slice(4, 8);
    }
    onChange(formatted);
  };

  const handleCalendarChange = (e) => {
    const iso = e.target.value;
    onChange(fromISO(iso));
  };

  const openCalendar = () => {
    if (hiddenRef.current) {
      hiddenRef.current.showPicker && hiddenRef.current.showPicker();
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-2" />
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          maxLength={10}
          placeholder={placeholder}
          value={value}
          onChange={handleTextChange}
          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
        />
        <input
          ref={hiddenRef}
          type="date"
          value={toISO(value)}
          onChange={handleCalendarChange}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          tabIndex={-1}
        />
        <button
          type="button"
          onClick={openCalendar}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ApoloReports = () => {
  const getCurrentWIBTime = () => {
    const now = new Date();
    return now;
  };

  const [currentDateTime, setCurrentDateTime] = useState(getCurrentWIBTime());
  const [disputeData, setDisputeData] = useState({});
  const [disputeFormData, setDisputeFormData] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedConfirmReport, setSelectedConfirmReport] = useState(null);
  const [showDisputeFormModal, setShowDisputeFormModal] = useState(false);
  const [selectedReportForDisputeForm, setSelectedReportForDisputeForm] = useState(null);
  const [disputeFormInput, setDisputeFormInput] = useState({
    alasanKeterlambatan: '',
    filePendukung: null
  });
  const [showRejectionDetailModal, setShowRejectionDetailModal] = useState(false);
  const [selectedRejectionReport, setSelectedRejectionReport] = useState(null);
  
  // State untuk periode tanggal - FORMAT DD/MM/YYYY
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  const [filters, setFilters] = useState({
    aplikasi: [],
    status: []
  });
  
  const [showAplikasiDropdown, setShowAplikasiDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  // Parse DD/MM/YYYY ke Date object
  const parseDDMMYYYY = (str) => {
    if (!str || str.length !== 10) return null;
    const [dd, mm, yyyy] = str.split('/');
    const d = new Date(+yyyy, +mm - 1, +dd);
    return isNaN(d.getTime()) ? null : d;
  };

  // Load dispute data from localStorage
  useEffect(() => {
    const savedDisputes = localStorage.getItem('apolo_disputes_v11');
    if (savedDisputes) {
      setDisputeData(JSON.parse(savedDisputes));
    }
    const savedDisputeForms = localStorage.getItem('apolo_dispute_forms_v11');
    if (savedDisputeForms) {
      setDisputeFormData(JSON.parse(savedDisputeForms));
    }
  }, []);

  const saveDisputeToLocalStorage = (disputes) => {
    localStorage.setItem('apolo_disputes_v11', JSON.stringify(disputes));
  };

  const saveDisputeFormToLocalStorage = (forms) => {
    localStorage.setItem('apolo_dispute_forms_v11', JSON.stringify(forms));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(getCurrentWIBTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const daysBetween = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getWorkingDaysBetween = (startDate, endDate) => {
    let count = 0;
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  // PERBAIKAN: Hitung expiry date berdasarkan tanggal upload
  const getExpiryDate = (startDate) => {
    const expiry = new Date(startDate);
    let daysAdded = 0;
    while (daysAdded < 5) {
      expiry.setDate(expiry.getDate() + 1);
      if (expiry.getDay() !== 0 && expiry.getDay() !== 6) {
        daysAdded++;
      }
    }
    expiry.setHours(23, 59, 59, 999);
    return expiry;
  };

  const getRemainingWorkingDays = (expiryDate) => {
    const now = new Date();
    if (now > expiryDate) return 0;
    
    let remaining = 0;
    const current = new Date(now);
    current.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    
    while (current <= expiry) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        remaining++;
      }
      current.setDate(current.getDate() + 1);
    }
    return remaining;
  };

  const getDisputeProgress = (startDate, expiryDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(expiryDate);
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    const percentage = (elapsed / totalDuration) * 100;
    
    return Math.min(100, Math.max(0, percentage));
  };

  // Data reports statis
  const initialReports = useMemo(() => {
    const reports = [
      {
        id: "APO001",
        namaAplikasi: "APOLO",
        namaLaporan: "Rencana Bisnis Bank",
        jenisPeriodeLaporan: "Tahunan",
        tglUpload: "2026-06-01 05:45:23",
        tglBatas: "2026-06-02",
        periodeData: "2026-04-01",
        statusPengiriman: "Berhasil",
        disputeStatus: null,
        disputeExpiryDate: null,
        disputeStartTime: null,
        detailForms: [
          { id: 1, namaForm: "Form Rencana Bisnis Bank - Laporan Utama", fileUrl: "/reports/APO001_form1.pdf" }
        ]
      },
      {
        id: "APO002",
        namaAplikasi: "APOLO",
        namaLaporan: "Laporan Rutin Bulanan",
        jenisPeriodeLaporan: "Bulanan",
        tglUpload: "2026-06-02 05:45:23",
        tglBatas: "2026-06-01",
        periodeData: "2026-05-01",
        statusPengiriman: "Berhasil",
        disputeStatus: null,
        disputeExpiryDate: null,
        disputeStartTime: null,
        detailForms: [
          { id: 1, namaForm: "Form Laporan Rutin Bulanan - Utama", fileUrl: "/reports/APO002_form1.pdf" }
        ]
      },
      {
        id: "APO003",
        namaAplikasi: "APOLO",
        namaLaporan: "Laporan Rutin Bulanan",
        jenisPeriodeLaporan: "Bulanan",
        tglUpload: "2026-06-02 05:45:23",
        tglBatas: "2026-06-01",
        periodeData: "2026-05-18",
        statusPengiriman: "Berhasil",
        disputeStatus: null,
        disputeExpiryDate: null,
        disputeStartTime: null,
        detailForms: [
          { id: 1, namaForm: "Form Laporan Rutin Bulanan - Utama", fileUrl: "/reports/APO003_form1.pdf" }
        ]
      },
      // {
      //   id: "APO004",
      //   namaAplikasi: "APOLO",
      //   namaLaporan: "Laporan Keuangan Tahunan",
      //   jenisPeriodeLaporan: "Tahunan",
      //   tglUpload: "2026-05-03 17:45:23",
      //   tglBatas: "2026-05-02",
      //   periodeData: "2026-05-01",
      //   statusPengiriman: "Berhasil",
      //   disputeStatus: null,
      //   disputeExpiryDate: null,
      //   disputeStartTime: null,
      //   detailForms: [
      //     { id: 1, namaForm: "Form Laporan Keuangan Tahunan", fileUrl: "/reports/APO004_form1.pdf" }
      //   ]
      // },
      {
        id: "APO005",
        namaAplikasi: "APOLO",
        namaLaporan: "Laporan Risiko Likuiditas",
        jenisPeriodeLaporan: "Bulanan",
        tglUpload: null,
        tglBatas: "2026-02-23",
        periodeData: "2026-02-01",
        statusPengiriman: "Belum Lapor",
        disputeStatus: null,
        disputeExpiryDate: null,
        disputeStartTime: null,
        detailForms: [
          { id: 1, namaForm: "Form Risiko Likuiditas", fileUrl: null }
        ]
      },
      {
        id: "ERP001",
        namaAplikasi: "e-Reporting",
        namaLaporan: "Laporan Publikasi Asuransi Jiwa Konvensional",
        jenisPeriodeLaporan: "Tahunan",
        tglUpload: null,
        tglBatas: "2026-05-09",
        periodeData: "2026-05-01",
        statusPengiriman: "Belum Lapor",
        disputeStatus: null,
        disputeExpiryDate: null,
        disputeStartTime: null,
        detailForms: [
          { id: 1, namaForm: "Form Publikasi Asuransi Jiwa", fileUrl: null }
        ]
      },
      {
        id: "ERP002",
        namaAplikasi: "e-Reporting",
        namaLaporan: "Laporan Asuransi Jiwa Syariah",
        jenisPeriodeLaporan: "Bulanan",
        tglUpload: "2026-04-30 17:45:23",
        tglBatas: "2026-04-29",
        periodeData: "2026-04-05",
        statusPengiriman: "Berhasil",
        disputeStatus: null,
        disputeExpiryDate: null,
        disputeStartTime: null,
        detailForms: [
          { id: 1, namaForm: "Form Asuransi Jiwa Syariah", fileUrl: "/reports/ERP002_form1.pdf" }
        ]
      },
      {
        id: "SIP001",
        namaAplikasi: "SIPINA",
        namaLaporan: "Laporan Penyampaian Informasi Nasabah Asing",
        jenisPeriodeLaporan: "Tahunan",
        tglUpload: "2026-04-24 17:45:23",
        tglBatas: "2026-04-25",
        periodeData: "2026-04-06",
        statusPengiriman: "Berhasil",
        disputeStatus: null,
        disputeExpiryDate: null,
        disputeStartTime: null,
        detailForms: [
          { id: 1, namaForm: "Form Informasi Nasabah Asing", fileUrl: "/reports/SIP001_form1.pdf" }
        ]
      },
      {
        id: "SIP002",
        namaAplikasi: "SIPINA",
        namaLaporan: "Laporan Reasuransi",
        jenisPeriodeLaporan: "Bulanan",
        tglUpload: "2026-04-24 17:45:23",
        tglBatas: "2026-04-23",
        periodeData: "2026-04-07",
        statusPengiriman: "Berhasil",
        disputeStatus: null,
        disputeExpiryDate: null,
        disputeStartTime: null,
        detailForms: [
          { id: 1, namaForm: "Form Reasuransi", fileUrl: "/reports/SIP002_form1.pdf" }
        ]
      }
    ];

    return reports;
  }, []);

  // Generate dispute start time when late occurs (hanya untuk APOLO)
  useEffect(() => {
    const now = new Date();
    const updatedDisputes = { ...disputeData };
    let hasChanges = false;
    
    initialReports.forEach(report => {
      if (report.namaAplikasi === "APOLO" && report.statusPengiriman === "Berhasil") {
        const uploadDate = report.tglUpload ? new Date(report.tglUpload) : null;
        const deadlineDate = new Date(report.tglBatas);
        deadlineDate.setHours(0, 0, 0, 0);
        
        let lateDays = 0;
        let isLate = false;
        
        if (uploadDate && uploadDate > deadlineDate) {
          lateDays = daysBetween(deadlineDate, uploadDate);
          isLate = true;
        } else if (!uploadDate && now > deadlineDate) {
          lateDays = daysBetween(deadlineDate, now);
          isLate = true;
        }
        
        if (isLate && !disputeData[report.id]) {
          // PERBAIKAN: Gunakan tanggal upload sebagai start date untuk hitung sisa waktu
          const disputeStartTime = uploadDate || new Date();
          const expiryDate = getExpiryDate(disputeStartTime);
          
          updatedDisputes[report.id] = {
            id: report.id,
            status: 'pending_confirmation',
            originalLateDays: lateDays,
            disputeStartDate: disputeStartTime.toISOString(),
            disputeExpiryDate: expiryDate.toISOString(),
            formSubmitted: false,
            confirmed: false,
            createdAt: new Date().toISOString(),
            rejectionReason: null,
            rejectionDocument: null,
            rejectionDocumentName: null
          };
          hasChanges = true;
        }
        else if (isLate && disputeData[report.id] && disputeData[report.id].status === 'pending_confirmation') {
          if (disputeData[report.id].originalLateDays !== lateDays) {
            updatedDisputes[report.id] = {
              ...disputeData[report.id],
              originalLateDays: lateDays
            };
            hasChanges = true;
          }
        }
      }
    });
    
    if (hasChanges) {
      setDisputeData(updatedDisputes);
      saveDisputeToLocalStorage(updatedDisputes);
    }
  }, [initialReports, currentDateTime]);

  // Auto-expire disputes
  useEffect(() => {
    const now = new Date();
    const updatedDisputes = { ...disputeData };
    let hasChanges = false;
    
    Object.keys(disputeData).forEach(id => {
      const dispute = disputeData[id];
      if (!dispute) return;
      
      const expiryDate = new Date(dispute.disputeExpiryDate);
      
      if (dispute.status === 'pending_confirmation' && !dispute.confirmed) {
        if (now > expiryDate) {
          updatedDisputes[id] = {
            ...dispute,
            status: 'expired',
            expiredAt: now.toISOString()
          };
          hasChanges = true;
        }
      }
      else if (dispute.status === 'pending_form' && !dispute.formSubmitted) {
        if (now > expiryDate) {
          updatedDisputes[id] = {
            ...dispute,
            status: 'expired',
            expiredAt: now.toISOString()
          };
          hasChanges = true;
        }
      }
    });
    
    if (hasChanges) {
      setDisputeData(updatedDisputes);
      saveDisputeToLocalStorage(updatedDisputes);
    }
  }, [currentDateTime, disputeData]);

  // Inisialisasi data Negative Confirmation untuk APO004
  useEffect(() => {
    const ap004Id = "APO004";
    
    if (!disputeData[ap004Id]) {
      const report = initialReports.find(r => r.id === ap004Id);
      const uploadDate = report?.tglUpload ? new Date(report.tglUpload) : new Date();
      const disputeStartDate = new Date(uploadDate);
      disputeStartDate.setDate(disputeStartDate.getDate() - 10);
      disputeStartDate.setHours(0, 0, 0, 0);
      
      const expiredDate = getExpiryDate(disputeStartDate);
      
      const updatedDisputes = { ...disputeData };
      updatedDisputes[ap004Id] = {
        id: ap004Id,
        status: 'expired',
        originalLateDays: 12,
        disputeStartDate: disputeStartDate.toISOString(),
        disputeExpiryDate: expiredDate.toISOString(),
        formSubmitted: false,
        confirmed: false,
        expiredAt: expiredDate.toISOString(),
        createdAt: disputeStartDate.toISOString(),
        rejectionReason: null,
        rejectionDocument: null,
        rejectionDocumentName: null
      };
      setDisputeData(updatedDisputes);
      saveDisputeToLocalStorage(updatedDisputes);
    }
  }, []);

  const calculateStatus = (report, currentDate, disputeInfo = null) => {
    const uploadDate = report.tglUpload ? new Date(report.tglUpload) : null;
    const deadlineDate = new Date(report.tglBatas);
    const systemDate = new Date(currentDate);
    
    deadlineDate.setHours(0, 0, 0, 0);
    systemDate.setHours(0, 0, 0, 0);
    if (uploadDate) uploadDate.setHours(0, 0, 0, 0);
    
    if ((report.namaAplikasi === "APOLO" || report.namaAplikasi === "e-Reporting")) {
      let lateDays = 0;
      if (!uploadDate && systemDate > deadlineDate) {
        lateDays = daysBetween(deadlineDate, systemDate);
      } else if (uploadDate && uploadDate > deadlineDate) {
        lateDays = daysBetween(deadlineDate, uploadDate);
      }
      
      if (lateDays >= 60) {
        return {
          finalStatus: 'tidak_lapor',
          lateDays: lateDays,
          statusBadge: 'Tidak Lapor',
          finalLabel: 'Tidak Lapor',
          disputeStatus: null,
          originalLateDays: lateDays
        };
      }
    }
    
    if (uploadDate && uploadDate <= deadlineDate) {
      return {
        finalStatus: 'tepat_waktu',
        lateDays: 0,
        statusBadge: 'Lapor',
        finalLabel: 'Lapor',
        disputeStatus: null,
        originalLateDays: 0
      };
    }
    
    if ((uploadDate && uploadDate > deadlineDate) || (!uploadDate && systemDate > deadlineDate)) {
      let lateDays = 0;
      if (uploadDate && uploadDate > deadlineDate) {
        lateDays = daysBetween(deadlineDate, uploadDate);
      } else if (!uploadDate && systemDate > deadlineDate) {
        lateDays = daysBetween(deadlineDate, systemDate);
      }
      
      return {
        finalStatus: 'terlambat',
        lateDays: lateDays,
        statusBadge: 'Terlambat',
        finalLabel: 'Terlambat',
        disputeStatus: null,
        originalLateDays: lateDays
      };
    }
    
    if (!uploadDate && systemDate <= deadlineDate) {
      return {
        finalStatus: 'belum_lapor',
        lateDays: null,
        statusBadge: 'Belum Lapor',
        finalLabel: 'Belum Lapor',
        disputeStatus: null,
        originalLateDays: null
      };
    }
    
    return {
      finalStatus: 'tepat_waktu',
      lateDays: 0,
      statusBadge: 'Lapor',
      finalLabel: 'Lapor',
      disputeStatus: null,
      originalLateDays: 0
    };
  };

  const canConfirm = (report, calculatedStatus) => {
    if (report.namaAplikasi !== "APOLO") return false;
    if (report.statusPengiriman !== "Berhasil") return false;
    if (calculatedStatus.finalStatus !== "terlambat") return false;
    if (calculatedStatus.lateDays >= 60) return false;
    if (calculatedStatus.lateDays <= 0) return false;
    
    const disputeInfo = disputeData[report.id];
    if (disputeInfo && (disputeInfo.status === 'accepted' || disputeInfo.status === 'rejected' || disputeInfo.status === 'expired')) return false;
    if (disputeInfo && disputeInfo.status === 'pending_form' && disputeInfo.formSubmitted) return false;
    
    return true;
  };

  const hasDisputeFormAvailable = (report) => {
    if (report.namaAplikasi !== "APOLO") return false;
    const disputeInfo = disputeData[report.id];
    if (disputeInfo && disputeInfo.status === 'accepted') return false;
    return disputeInfo && disputeInfo.status === 'pending_form' && !disputeInfo.formSubmitted;
  };

  const getDisputeProgressValue = (report) => {
    const disputeInfo = disputeData[report.id];
    if (!disputeInfo) return 0;
    if (disputeInfo.status !== 'pending_confirmation' && disputeInfo.status !== 'pending_form') return 0;
    
    return getDisputeProgress(disputeInfo.disputeStartDate, disputeInfo.disputeExpiryDate);
  };

  // Filter data berdasarkan periode data (DD/MM/YYYY)
  const filterByDateRange = (data) => {
    const startDate = parseDDMMYYYY(dateRange.startDate);
    const endDate = parseDDMMYYYY(dateRange.endDate);
    
    if (!startDate || !endDate) {
      return [];
    }
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    return data.filter(item => {
      const periodeData = new Date(item.periodeData);
      if (isNaN(periodeData.getTime())) return false;
      return periodeData >= startDate && periodeData <= endDate;
    });
  };

  // Proses data reports dengan filter tanggal
  const reportsWithPeriod = useMemo(() => {
    const filteredByDate = filterByDateRange(initialReports);
    
    if (filteredByDate.length === 0) return [];
    
    const systemDate = new Date(currentDateTime);
    systemDate.setHours(0, 0, 0, 0);

    const processed = filteredByDate.map(report => {
      const dispute = disputeData[report.id];
      let calculated = calculateStatus(report, systemDate, dispute);
      
      if (dispute) {
        if (dispute.status === 'accepted') {
          calculated = {
            ...calculated,
            finalStatus: 'terlambat',
            finalLabel: 'Terlambat',
            disputeStatus: 'accepted',
            originalLateDays: dispute.originalLateDays
          };
        } else if (dispute.status === 'rejected') {
          calculated = {
            ...calculated,
            finalStatus: 'terlambat',
            finalLabel: 'Terlambat',
            disputeStatus: 'rejected',
            rejectionReason: dispute.rejectionReason,
            rejectionDocument: dispute.rejectionDocument,
            rejectionDocumentName: dispute.rejectionDocumentName,
            originalLateDays: dispute.originalLateDays
          };
        } else if (dispute.status === 'expired') {
          calculated = {
            ...calculated,
            finalStatus: 'terlambat',
            finalLabel: 'Terlambat',
            disputeStatus: 'expired',
            originalLateDays: dispute.originalLateDays,
            isNegativeConfirmation: true
          };
        } else if (dispute.status === 'pending_form') {
          const expiryDate = new Date(dispute.disputeExpiryDate);
          const remainingDays = getRemainingWorkingDays(expiryDate);
          
          calculated = {
            ...calculated,
            finalStatus: 'terlambat',
            finalLabel: 'Terlambat',
            disputeStatus: 'pending_form',
            disputeExpiryDate: expiryDate,
            remainingWorkingDays: remainingDays,
            disputeStartDate: dispute.disputeStartDate,
            originalLateDays: dispute.originalLateDays
          };
        } else if (dispute.status === 'pending_confirmation') {
          const expiryDate = new Date(dispute.disputeExpiryDate);
          const remainingDays = getRemainingWorkingDays(expiryDate);
          
          calculated = {
            ...calculated,
            finalStatus: 'terlambat',
            finalLabel: 'Terlambat',
            disputeStatus: 'pending_confirmation',
            disputeExpiryDate: expiryDate,
            remainingWorkingDays: remainingDays,
            disputeStartDate: dispute.disputeStartDate,
            originalLateDays: dispute.originalLateDays
          };
        }
      }
      
      const formatDateTime = (dateTime) => {
        if (!dateTime) return '-';
        const d = new Date(dateTime);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(/\./g, ':');
      };
      
      const formatDateOnly = (date) => {
        if (!date) return '-';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      };
      
      return {
        ...report,
        displayUpload: formatDateTime(report.tglUpload),
        displayBatas: formatDateOnly(report.tglBatas),
        displayPeriodeData: formatDateOnly(report.periodeData),
        finalStatus: calculated.finalStatus,
        lateDays: calculated.lateDays,
        finalLabel: calculated.finalLabel,
        disputeStatus: calculated.disputeStatus,
        statusBadge: calculated.statusBadge,
        originalLateDays: calculated.originalLateDays,
        canConfirm: canConfirm(report, calculated),
        hasDisputeForm: hasDisputeFormAvailable(report),
        disputeExpiryDate: calculated.disputeExpiryDate,
        remainingWorkingDays: calculated.remainingWorkingDays,
        disputeStartDate: calculated.disputeStartDate,
        rejectionReason: calculated.rejectionReason,
        rejectionDocument: calculated.rejectionDocument,
        rejectionDocumentName: calculated.rejectionDocumentName,
        isNegativeConfirmation: calculated.isNegativeConfirmation
      };
    });
    
    return processed;
  }, [dateRange, initialReports, disputeData, currentDateTime]);

  const handleAplikasiFilterChange = (value) => {
    setFilters(prev => {
      const currentValues = [...prev.aplikasi];
      if (currentValues.includes(value)) {
        return { ...prev, aplikasi: currentValues.filter(v => v !== value) };
      } else {
        return { ...prev, aplikasi: [...currentValues, value] };
      }
    });
  };

  const handleStatusFilterChange = (value) => {
    setFilters(prev => {
      const currentValues = [...prev.status];
      if (currentValues.includes(value)) {
        return { ...prev, status: currentValues.filter(v => v !== value) };
      } else {
        return { ...prev, status: [...currentValues, value] };
      }
    });
  };

  const filteredReports = useMemo(() => {
    let filtered = [...reportsWithPeriod];

    if (filters.aplikasi.length > 0) {
      filtered = filtered.filter(report => filters.aplikasi.includes(report.namaAplikasi));
    }
    
    if (filters.status.length > 0) {
      filtered = filtered.filter(report => filters.status.includes(report.finalStatus));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(report => 
        report.namaLaporan.toLowerCase().includes(term) ||
        report.namaAplikasi.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [filters, searchTerm, reportsWithPeriod]);

  const getAplikasiOptions = () => {
    const aplikasiList = [...new Set(initialReports.map(r => r.namaAplikasi))];
    return aplikasiList.map(app => ({ value: app, label: app }));
  };

  const getStatusOptions = () => {
    return [
      { value: 'tepat_waktu', label: 'Lapor' },
      { value: 'terlambat', label: 'Terlambat' },
      { value: 'belum_lapor', label: 'Belum Lapor' },
      { value: 'tidak_lapor', label: 'Tidak Lapor' }
    ];
  };

  const stats = useMemo(() => {
    const total = reportsWithPeriod.length;
    const tepatWaktu = reportsWithPeriod.filter(r => r.finalStatus === 'tepat_waktu').length;
    const terlambat = reportsWithPeriod.filter(r => r.finalStatus === 'terlambat').length;
    const belumLapor = reportsWithPeriod.filter(r => r.finalStatus === 'belum_lapor').length;
    const tidakLapor = reportsWithPeriod.filter(r => r.finalStatus === 'tidak_lapor').length;
    
    return {
      total,
      tepatWaktu,
      terlambat,
      belumLapor,
      tidakLapor
    };
  }, [reportsWithPeriod]);

  const resetFilters = () => {
    setDateRange({
      startDate: '',
      endDate: ''
    });
    setFilters({
      aplikasi: [],
      status: []
    });
    setSearchTerm('');
    setSelectedReport(null);
  };

  const hasValidDates = parseDDMMYYYY(dateRange.startDate) && parseDDMMYYYY(dateRange.endDate);

  const handleOpenConfirmModal = (report) => {
    setSelectedConfirmReport(report);
    setShowConfirmModal(true);
  };

  const handleOpenDisputeForm = (report) => {
    setSelectedReportForDisputeForm(report);
    setDisputeFormInput({
      alasanKeterlambatan: '',
      filePendukung: null
    });
    setShowDisputeFormModal(true);
  };

  const handleAgreeLate = (report) => {
    const disputeInfo = disputeData[report.id];
    
    const newDispute = {
      ...disputeInfo,
      status: 'rejected',
      acknowledged: true,
      acknowledgedLateDays: report.originalLateDays || disputeInfo?.originalLateDays,
      confirmedAt: new Date().toISOString(),
      confirmedChoice: 'setuju',
      rejectionReason: null,
      rejectionDocument: null,
      rejectionDocumentName: null
    };
    
    const updatedDisputes = { 
      ...disputeData, 
      [report.id]: newDispute
    };
    setDisputeData(updatedDisputes);
    saveDisputeToLocalStorage(updatedDisputes);
    
    setShowConfirmModal(false);
    setSelectedConfirmReport(null);
  };

  const handleDisagreeLate = (report) => {
    let disputeInfo = disputeData[report.id];
    let disputeStartDate;
    let expiryDate;
    
    if (disputeInfo && disputeInfo.disputeStartDate) {
      disputeStartDate = new Date(disputeInfo.disputeStartDate);
      expiryDate = getExpiryDate(disputeStartDate);
    } else {
      disputeStartDate = new Date();
      expiryDate = getExpiryDate(disputeStartDate);
    }
    
    const newDispute = {
      id: report.id,
      status: 'pending_form',
      originalLateDays: report.originalLateDays,
      disputeStartDate: disputeStartDate.toISOString(),
      disputeExpiryDate: expiryDate.toISOString(),
      formSubmitted: false,
      confirmedAt: new Date().toISOString(),
      confirmedChoice: 'tidak_setuju',
      createdAt: new Date().toISOString(),
      rejectionReason: null,
      rejectionDocument: null,
      rejectionDocumentName: null
    };
    
    const updatedDisputes = { ...disputeData, [report.id]: newDispute };
    setDisputeData(updatedDisputes);
    saveDisputeToLocalStorage(updatedDisputes);
    
    setShowConfirmModal(false);
    setSelectedConfirmReport(null);
  };

  const handleDisputeFormSubmit = () => {
    if (!disputeFormInput.alasanKeterlambatan) {
      alert('Harap isi alasan keterlambatan');
      return;
    }
    
    if (!disputeFormInput.filePendukung) {
      alert('Harap upload surat pendukung yang ditandatangani direksi');
      return;
    }
    
    const randomDecision = Math.random();
    const isAccepted = randomDecision < 0.5;
    
    const existingDispute = disputeData[selectedReportForDisputeForm.id] || {};
    
    let newDispute;
    
    if (isAccepted) {
      newDispute = {
        id: selectedReportForDisputeForm.id,
        status: 'accepted',
        alasanKeterlambatan: disputeFormInput.alasanKeterlambatan,
        filePendukung: disputeFormInput.filePendukung.name,
        originalLateDays: selectedReportForDisputeForm.originalLateDays,
        acceptedLateDays: selectedReportForDisputeForm.originalLateDays,
        acceptedStatus: 'terlambat',
        formSubmitted: true,
        submittedAt: new Date().toISOString(),
        disputeStartDate: existingDispute.disputeStartDate,
        disputeExpiryDate: existingDispute.disputeExpiryDate,
        confirmedChoice: existingDispute.confirmedChoice,
        confirmedAt: existingDispute.confirmedAt,
        createdAt: existingDispute.createdAt || new Date().toISOString(),
        rejectionReason: null,
        rejectionDocument: null,
        rejectionDocumentName: null
      };
    } else {
      newDispute = {
        id: selectedReportForDisputeForm.id,
        status: 'rejected',
        alasanKeterlambatan: disputeFormInput.alasanKeterlambatan,
        filePendukung: disputeFormInput.filePendukung.name,
        originalLateDays: selectedReportForDisputeForm.originalLateDays,
        acceptedLateDays: selectedReportForDisputeForm.originalLateDays,
        acceptedStatus: 'terlambat',
        formSubmitted: true,
        submittedAt: new Date().toISOString(),
        disputeStartDate: existingDispute.disputeStartDate,
        disputeExpiryDate: existingDispute.disputeExpiryDate,
        confirmedChoice: existingDispute.confirmedChoice,
        confirmedAt: existingDispute.confirmedAt,
        createdAt: existingDispute.createdAt || new Date().toISOString(),
        rejectionReason: 'Berdasarkan hasil verifikasi, alasan keterlambatan yang disampaikan tidak dapat diterima karena tidak terdapat bukti pendukung yang memadai sesuai dengan ketentuan.',
        rejectionDocument: '/rejection/rejection_letter_' + selectedReportForDisputeForm.id + '.pdf',
        rejectionDocumentName: 'Surat_Penolakan_Sanggahan_' + selectedReportForDisputeForm.id + '.pdf'
      };
    }
    
    const updatedForms = { ...disputeFormData, [selectedReportForDisputeForm.id]: disputeFormInput };
    setDisputeFormData(updatedForms);
    saveDisputeFormToLocalStorage(updatedForms);
    
    const updatedDisputes = { ...disputeData, [selectedReportForDisputeForm.id]: newDispute };
    setDisputeData(updatedDisputes);
    saveDisputeToLocalStorage(updatedDisputes);
    
    setShowDisputeFormModal(false);
    setSelectedReportForDisputeForm(null);
    
    if (isAccepted) {
      alert('Sanggahan dalam proses, akan diproses pengawas.');
    } else {
      alert('Sanggahan dalam proses,akan diproses pengawas.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDisputeFormInput({ ...disputeFormInput, filePendukung: file });
    }
  };

  const handleDownloadRejectionDoc = (report) => {
    if (report.rejectionDocument) {
      const link = document.createElement('a');
      link.href = report.rejectionDocument;
      link.download = report.rejectionDocumentName || 'surat_penolakan.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Dokumen tidak tersedia');
    }
  };

  const handleOpenRejectionDetail = (report) => {
    setSelectedRejectionReport(report);
    setShowRejectionDetailModal(true);
  };

  const getStatusBadge = (report) => {
    const { finalStatus, namaAplikasi, originalLateDays, isNegativeConfirmation } = report;
    
    if (finalStatus === 'tepat_waktu') {
      return <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Lapor</span>;
    } else if (finalStatus === 'belum_lapor') {
      return <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Belum Lapor</span>;
    } else if (finalStatus === 'tidak_lapor') {
      return <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Tidak Lapor</span>;
    } else if (finalStatus === 'terlambat') {
      if ((namaAplikasi === 'APOLO' || namaAplikasi === 'e-Reporting') && originalLateDays > 0 && !isNegativeConfirmation) {
        return (
          <div className="text-left">
            <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Terlambat</span>
            <div className="text-xs text-red-600 font-medium mt-0.5">{originalLateDays} Hari Terlambat</div>
            <div className="text-[10px] text-gray-400">*Perhitungan berdasarkan sistem</div>
          </div>
        );
      }
      return <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Terlambat</span>;
    }
    
    return <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">-</span>;
  };

  const DisputeProgressBar = ({ remainingDays, progressPercentage }) => {
    const getBarColor = () => {
      if (remainingDays <= 1) return 'bg-red-500';
      if (remainingDays <= 2) return 'bg-orange-500';
      return 'bg-blue-500';
    };

    return (
      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">Sisa waktu sanggah:</span>
          <span className={`font-semibold ${remainingDays <= 1 ? 'text-red-600' : remainingDays <= 2 ? 'text-orange-600' : 'text-blue-600'}`}>
            {remainingDays} hari kerja
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {remainingDays <= 1 && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Segera lakukan konfirmasi sebelum waktu habis!
          </p>
        )}
      </div>
    );
  };

  const getConfirmationButton = (report) => {
    if (report.isNegativeConfirmation || report.disputeStatus === 'expired') {
      return (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleOpenRejectionDetail(report)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-500 text-white border border-gray-600 hover:bg-gray-600 transition-colors"
          >
            Negative Confirmation
          </button>
        </div>
      );
    }
    
    if (report.disputeStatus === 'accepted') {
      return (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleOpenRejectionDetail(report)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white border border-green-600 hover:bg-green-700 transition-colors"
          >
            Sanggahan Diterima
          </button>
        </div>
      );
    }
    
    if (report.disputeStatus === 'rejected' && report.rejectionReason) {
      return (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleOpenRejectionDetail(report)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white border border-red-600 hover:bg-red-700 transition-colors"
          >
            Sanggahan Ditolak
          </button>
        </div>
      );
    }
    
    if (report.disputeStatus === 'rejected' && !report.rejectionReason) {
      return (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleOpenRejectionDetail(report)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-600 text-white border border-orange-600 hover:bg-orange-700 transition-colors"
          >
            Mengakui Keterlambatan
          </button>
        </div>
      );
    }
    
    if (report.hasDisputeForm) {
      const remainingDays = report.remainingWorkingDays;
      const progressPercentage = getDisputeProgressValue(report);
      
      return (
        <div className="flex flex-col gap-2 min-w-[180px]">
          <button
            onClick={() => handleOpenDisputeForm(report)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition-colors"
          >
            Isi Form Sanggahan
          </button>
          <DisputeProgressBar 
            remainingDays={remainingDays} 
            progressPercentage={progressPercentage}
          />
        </div>
      );
    }
    
    if (report.disputeStatus === 'pending_confirmation' && report.canConfirm) {
      const remainingDays = report.remainingWorkingDays;
      const progressPercentage = getDisputeProgressValue(report);
      
      return (
        <div className="flex flex-col gap-2 min-w-[180px]">
          <button
            onClick={() => handleOpenConfirmModal(report)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-600 text-white border border-orange-600 hover:bg-orange-700 transition-colors"
          >
            Konfirmasi Keterlambatan
          </button>
          <DisputeProgressBar 
            remainingDays={remainingDays} 
            progressPercentage={progressPercentage}
          />
        </div>
      );
    }
    
    if (report.canConfirm && !report.disputeStatus) {
      const remainingDays = 5;
      const progressPercentage = 0;
      
      return (
        <div className="flex flex-col gap-2 min-w-[180px]">
          <button
            onClick={() => handleOpenConfirmModal(report)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-600 text-white border border-orange-600 hover:bg-orange-700 transition-colors"
          >
            Konfirmasi Keterlambatan
          </button>
          <DisputeProgressBar 
            remainingDays={remainingDays} 
            progressPercentage={progressPercentage}
          />
        </div>
      );
    }
    
    return (
      <span className="text-xs text-gray-400 italic text-center">-</span>
    );
  };

  const getAplikasiBadge = (aplikasi) => {
    const colorMap = {
      'APOLO': 'bg-blue-100 text-blue-800 border-blue-200',
      'e-Reporting': 'bg-green-100 text-green-800 border-green-200',
      'SIPINA': 'bg-purple-100 text-purple-800 border-purple-200',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorMap[aplikasi]}`}>
        {aplikasi}
      </span>
    );
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
  };

  const handleExportData = () => {
    const exportData = filteredReports.map(report => ({
      'No': report.id,
      'Nama Aplikasi': report.namaAplikasi,
      'Nama Laporan': report.namaLaporan,
      'Jenis Periode Laporan': report.jenisPeriodeLaporan,
      'Tgl Upload/Penyampaian': report.displayUpload,
      'Status': report.finalLabel,
      'Periode Data': report.displayPeriodeData,
      'Tgl Batas Akhir': report.displayBatas
    }));

    const csv = convertToCSV(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring-irs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${String(row[header] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    return csv;
  };

  const formatDateDisplay = (ddmmyyyy) => {
    const d = parseDDMMYYYY(ddmmyyyy);
    if (!d) return ddmmyyyy || "-";
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCurrentDateDisplay = () => {
    return currentDateTime.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentTimeDisplay = () => {
    return currentDateTime.toLocaleTimeString('id-ID', { 
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50/20 to-white min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-red-600 via-red-500 to-red-700 rounded-xl shadow-lg">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-red-900">Monitoring Absensi IRS</h1>
            <p className="text-gray-600 mt-1">Monitoring Laporan Rutin - Total {stats.total} Laporan</p>
            <div className="flex items-center space-x-4 mt-1 flex-wrap">
              <p className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-200">
                <Clock className="w-3 h-3 inline mr-1" />
                Waktu Real-time: {getCurrentTimeDisplay()}
              </p>
              <p className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-200">
                <Calendar className="w-3 h-3 inline mr-1" />
                {getCurrentDateDisplay()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="p-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl transition-all duration-200 shadow hover:shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="px-6">
        <div className="bg-gradient-to-br from-white to-red-50/30 rounded-xl shadow-lg border border-red-100 overflow-hidden">
          <div className="p-6 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-red-100 to-red-200 rounded-lg shadow-sm">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-900">Filter Periode Laporan</h3>
                  <p className="text-sm text-gray-600">Pilih rentang tanggal periode data laporan <span className="text-red-500">*Wajib diisi</span></p>
                </div>
              </div>
              <button
                onClick={resetFilters}
                className="text-sm text-red-600 hover:text-red-800 font-medium px-4 py-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Reset Semua Filter
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateInputDDMMYYYY
                  label="Tanggal Mulai Periode Laporan"
                  required
                  value={dateRange.startDate}
                  onChange={(val) => setDateRange(prev => ({ ...prev, startDate: val }))}
                />
                <DateInputDDMMYYYY
                  label="Tanggal Akhir Periode Laporan"
                  required
                  value={dateRange.endDate}
                  onChange={(val) => setDateRange(prev => ({ ...prev, endDate: val }))}
                />
              </div>
              {!hasValidDates && (
                <p className="text-sm text-red-500 mt-2">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Harap isi tanggal mulai dan akhir periode laporan (format DD/MM/YYYY)
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Filter Aplikasi (Multiple)
                </label>
                <button
                  onClick={() => setShowAplikasiDropdown(!showAplikasiDropdown)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-left flex justify-between items-center"
                >
                  <span className="text-gray-700">
                    {filters.aplikasi.length === 0 
                      ? 'Semua Aplikasi' 
                      : `${filters.aplikasi.length} terpilih`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {showAplikasiDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                    <div className="p-2">
                      {getAplikasiOptions().map((option) => (
                        <label key={option.value} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.aplikasi.includes(option.value)}
                            onChange={() => handleAplikasiFilterChange(option.value)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Filter Status (Multiple)
                </label>
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-left flex justify-between items-center"
                >
                  <span className="text-gray-700">
                    {filters.status.length === 0 
                      ? 'Semua Status' 
                      : `${filters.status.length} terpilih`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {showStatusDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                    <div className="p-2">
                      {getStatusOptions().map((option) => (
                        <label key={option.value} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.status.includes(option.value)}
                            onChange={() => handleStatusFilterChange(option.value)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Cari Laporan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama laporan atau aplikasi"
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Laporan</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Lapor</p>
                <p className="text-2xl font-bold text-green-900">{stats.tepatWaktu}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 shadow-sm border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Terlambat</p>
                <p className="text-2xl font-bold text-red-900">{stats.terlambat}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 shadow-sm border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Belum Lapor</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.belumLapor}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Tidak Lapor</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tidakLapor}</p>
              </div>
              <XCircle className="w-8 h-8 text-gray-500 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="px-6 pb-6">
        <div className="bg-gradient-to-br from-white to-red-50/30 rounded-xl shadow-lg border border-red-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gradient-to-r from-red-100 to-red-200 rounded-lg shadow-sm flex-shrink-0">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-red-900 truncate">
                      Daftar Laporan 
                    </h3>
                    <div className="mt-2 space-y-1">
                      {hasValidDates && (
                        <p className="text-sm text-gray-600 truncate">
                          Periode Data: <span className="font-medium">{formatDateDisplay(dateRange.startDate)}</span> - <span className="font-medium">{formatDateDisplay(dateRange.endDate)}</span>
                        </p>
                      )}
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Tanggal:</span> {getCurrentDateDisplay()}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {filteredReports.length} dari {reportsWithPeriod.length} laporan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200 min-w-0">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Menampilkan: <span className="font-bold">{filteredReports.length}</span> dari <span className="font-bold">{reportsWithPeriod.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-12">No</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Aplikasi</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Laporan</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Jenis Periode Laporan</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tgl Upload/Penyampaian</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
                  {/* <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[220px]">Konfirmasi</th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report, index) => (
                  <tr key={report.id} className={`hover:bg-blue-50/50 transition-colors duration-200 ${
                    report.finalStatus === 'terlambat' ? 'bg-red-50/30' : 
                    report.finalStatus === 'belum_lapor' ? 'bg-yellow-50/30' :
                    report.finalStatus === 'tidak_lapor' ? 'bg-gray-50/30' : ''
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getAplikasiBadge(report.namaAplikasi)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {report.namaLaporan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.jenisPeriodeLaporan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.displayUpload}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      {getStatusBadge(report)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(report)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                    {/* <td className="px-6 py-4">
                      {getConfirmationButton(report)}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {!hasValidDates ? 'Pilih Periode Tanggal Terlebih Dahulu' : 'Tidak ada laporan ditemukan'}
              </h3>
              <p className="text-gray-600">
                {!hasValidDates 
                  ? 'Silakan isi tanggal mulai dan akhir periode laporan (format DD/MM/YYYY)'
                  : 'Tidak ada laporan yang sesuai dengan kriteria pencarian atau filter'}
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          )}

          {filteredReports.length > 0 && (
            <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm text-gray-600">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Data diperbarui real-time
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="text-xs md:text-sm text-gray-600">
                    <span className="font-medium">
                      Halaman 1 dari {Math.ceil(filteredReports.length / 10) || 1}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && selectedConfirmReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Konfirmasi Keterlambatan</h3>
                </div>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedConfirmReport(null);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold">{selectedConfirmReport.namaLaporan}</span> periode <span className="font-semibold">{selectedConfirmReport.displayPeriodeData}</span> <br></br>
                  mengalami keterlambatan sebanyak <span className="font-bold text-red-600">{selectedConfirmReport.originalLateDays || selectedConfirmReport.lateDays} hari</span>.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">Informasi:</p>
                    <p>Jika memilih "Setuju", Anda akan mengakui keterlambatan.</p>
                    <p className="mt-1">Jika memilih "Tidak Setuju", Anda akan diberikan waktu 5 hari kerja untuk mengisi form sanggahan beserta upload surat pendukung yang ditandatangani Direksi. Jika melebihi batas waktu, status akan menjadi Negative Confirmation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedConfirmReport(null);
                }}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Batal
              </button>
              <button
                onClick={() => handleAgreeLate(selectedConfirmReport)}
                className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium text-sm"
              >
                Setuju
              </button>
              <button
                onClick={() => handleDisagreeLate(selectedConfirmReport)}
                className="px-5 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium text-sm"
              >
                Tidak Setuju
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Form Modal */}
      {showDisputeFormModal && selectedReportForDisputeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Form Sanggahan Keterlambatan</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {selectedReportForDisputeForm.namaLaporan}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDisputeFormModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Informasi Penting:</p>
                    <p className="mt-1">Dokumen pendukung yang diupload harus ditandatangani oleh Direksi.</p>
                    <p className="mt-1">Sanggahan akan direview oleh pengawas dan keputusan bersifat final.</p>
                    <p className="mt-2 font-medium text-red-600">Jumlah hari terlambat saat ini: {selectedReportForDisputeForm.originalLateDays} hari</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alasan Keterlambatan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    value={disputeFormInput.alasanKeterlambatan}
                    onChange={(e) => setDisputeFormInput({ ...disputeFormInput, alasanKeterlambatan: e.target.value })}
                    placeholder="Jelaskan alasan keterlambatan dengan detail..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Surat Pendukung <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50/50">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="dispute-file-upload"
                      accept=".pdf,.doc,.docx"
                    />
                    <label htmlFor="dispute-file-upload" className="cursor-pointer block">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {disputeFormInput.filePendukung ? disputeFormInput.filePendukung.name : 'Klik untuk upload file'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Format PDF, DOC, DOCX (Maks. 5MB)
                      </p>
                    </label>
                  </div>
                  <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Surat pendukung harus ditandatangani oleh Direksi
                  </p>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDisputeFormModal(false)}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleDisputeFormSubmit}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Kirim Sanggahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Detail Modal */}
      {showRejectionDetailModal && selectedRejectionReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <FileWarning className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedRejectionReport.disputeStatus === 'accepted' ? 'Keputusan Sanggahan' : 'Penolakan Sanggahan'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedRejectionReport.namaLaporan}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRejectionDetailModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {selectedRejectionReport.disputeStatus === 'accepted' ? (
                <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-800">Sanggahan Diterima</p>
                      <p className="text-sm text-green-700 mt-1">
                        Berdasarkan hasil review, sanggahan Anda telah diterima.
                      </p>
                    </div>
                  </div>
                </div>
              ) : selectedRejectionReport.rejectionReason ? (
                <>
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertOctagon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-red-800">Sanggahan Ditolak</p>
                        <p className="text-sm text-red-700 mt-2 leading-relaxed">
                          {selectedRejectionReport.rejectionReason}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-xs text-yellow-800 flex items-start gap-2">
                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      Status laporan<span className="font-semibold">Terlambat ({selectedRejectionReport.originalLateDays} Hari)</span>.
                    </p>
                  </div>
                </>
              ) : selectedRejectionReport.disputeStatus === 'rejected' ? (
                <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
                  <div>
                    <p className="font-semibold text-orange-800">Mengakui Keterlambatan</p>
                    <p className="text-sm text-orange-700 mt-1">
                      Anda telah mengakui keterlambatan sebesar <span className="font-bold">{selectedRejectionReport.originalLateDays} hari</span>.
                    </p>
                  </div>
                </div>
              ) : selectedRejectionReport.isNegativeConfirmation ? (
                <div className="bg-gray-100 border-l-4 border-gray-500 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Negative Confirmation</p>
                      <p className="text-sm text-gray-700 mt-1">
                        Anda tidak melakukan konfirmasi dalam waktu 5 hari kerja.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowRejectionDetailModal(false)}
                className="w-full px-5 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal - DENGAN LIST NAMA FORM */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">Detail Laporan</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getAplikasiBadge(selectedReport.namaAplikasi)}
                      <span className="text-gray-600">• ID: {selectedReport.id}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Nama Laporan</h4>
                  <p className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedReport.namaLaporan}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Aplikasi</h4>
                  {getAplikasiBadge(selectedReport.namaAplikasi)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Jenis Periode Laporan</h4>
                  <p className="text-gray-900">{selectedReport.jenisPeriodeLaporan}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Tanggal Deadline</h4>
                  <p className="text-gray-900">{selectedReport.displayBatas}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Tanggal Upload</h4>
                  <p className="text-gray-900">{selectedReport.displayUpload}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Periode Data</h4>
                  <p className="text-gray-900">{selectedReport.displayPeriodeData}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                  <div className="text-left">
                    {getStatusBadge(selectedReport)}
                  </div>
                </div>
              </div>

              {/* ===== TABEL DAFTAR NAMA FORM ===== */}
              <div className="bg-green-50 rounded-xl p-4 md:p-5 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <ClipboardList className="w-5 h-5 text-green-600" />
                  <h4 className="text-base font-semibold text-green-900">Daftar Nama Form</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-green-200">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-green-800 uppercase tracking-wider w-12">No</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Nama Form</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-green-100">
                      {FORM_LIST.map((form) => (
                        <tr key={form.no} className="hover:bg-green-50/50 transition-colors">
                          <td className="px-4 py-2 text-sm text-gray-500 text-center">{form.no}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">{form.namaForm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                {selectedReport.canConfirm && !selectedReport.disputeStatus && (
                  <button
                    onClick={() => {
                      setSelectedReport(null);
                      handleOpenConfirmModal(selectedReport);
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Konfirmasi Keterlambatan
                  </button>
                )}
                {selectedReport.hasDisputeForm && (
                  <button
                    onClick={() => {
                      setSelectedReport(null);
                      handleOpenDisputeForm(selectedReport);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Isi Form Sanggahan
                  </button>
                )}
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApoloReports;