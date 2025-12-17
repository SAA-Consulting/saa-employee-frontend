'use client';

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StrapiMedia, Payslip } from '@/types';
import { payslipsApi } from '@/utils/payslips';

// Constants
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

// Utility functions
const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'NIL';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'NIL';
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Components
const CollapsibleSection = ({
    title,
    children,
    isOpen,
    onToggle,
}: {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
                onClick={onToggle}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            >
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
            {isOpen && <div className="px-6 pb-6">{children}</div>}
        </div>
    );
};

const DocumentCard = ({ document }: { document: StrapiMedia }) => {
    const documentUrl = `${STRAPI_BASE_URL}${document.url}`;

    const handleDocumentClick = () => {
        window.open(documentUrl, '_blank');
    };

    return (
        <div
            className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors duration-200"
            onClick={handleDocumentClick}
        >
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{document.name}</p>
                    <p className="text-xs text-blue-600 mt-1">Click to view</p>
                </div>
                <div className="flex-shrink-0">
                    <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

const RedactedField = ({
    value,
    className,
    blurPercent = 50,
}: {
    value?: string | null;
    className?: string;
    blurPercent?: number;
}) => {
    const [revealed, setRevealed] = useState(false);
    const blurStrength = Math.max(0, Math.min(100, blurPercent));
    const blurValue = `blur(${(blurStrength / 100) * 8}px)`;

    if (!value) {
        return (
            <span className={`mt-1 text-sm text-gray-900 ${className || ''}`}>
                Not provided
            </span>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setRevealed((prev) => !prev)}
            className={`group relative inline-flex w-full items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-left transition hover:border-blue-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 ${className || ''}`}
        >
            <span
                className={`text-sm font-medium transition ${
                    revealed ? 'text-gray-900' : 'text-gray-900 select-none'
                }`}
                style={revealed ? undefined : { filter: blurValue }}
            >
                {value}
            </span>
            <span className="pointer-events-none ml-3 flex items-center text-gray-400 transition group-hover:text-gray-600">
                {revealed ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.5 4.5l15 15M9.88 9.88a3 3 0 104.24 4.24M6.68 6.73A10.45 10.45 0 0112 5c7 0 10.5 7 10.5 7a17.5 17.5 0 01-3.25 3.85M14.12 14.12l5.16 5.16"
                        />
                    </svg>
                ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12 18 19.5 12 19.5 2.25 12 2.25 12z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 14.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                        />
                    </svg>
                )}
            </span>
            {!revealed && (
                <span className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition group-hover:opacity-100" />
            )}
        </button>
    );
};

const PayslipCard = ({
    payslip,
    onDownload,
}: {
    payslip: Payslip;
    onDownload: (payslip: Payslip) => void;
}) => {
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handlePayslipClick = () => {
        onDownload(payslip);
    };

    return (
        <div
            className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 hover:border-green-300 transition-colors duration-200"
            onClick={handlePayslipClick}
        >
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {payslip.month_name} {payslip.year}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {formatFileSize(payslip.file_size)} • {formatDate(payslip.modified_at)}
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default function ProfilePage() {
    const { user, logout, isLoading, isAuthenticated, token } = useAuth();
    const router = useRouter();

    // State for collapsible sections
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(true);
    const [isContractOpen, setIsContractOpen] = useState(true);
    const [isPersonalOpen, setIsPersonalOpen] = useState(true);
    const [isAddressOpen, setIsAddressOpen] = useState(true);
    const [isBankOpen, setIsBankOpen] = useState(false);
    const [isPFOpen, setIsPFOpen] = useState(false);
    const [isEducationOpen, setIsEducationOpen] = useState(false);
    const [isPreviousEmploymentOpen, setIsPreviousEmploymentOpen] = useState(false);

    // State for payslips
    const [payslips, setPayslips] = useState<Payslip[]>([]);
    const [payslipsLoading, setPayslipsLoading] = useState(false);
    const [payslipsError, setPayslipsError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Fetch payslips when user is authenticated
    useEffect(() => {
        if (isAuthenticated && token && user) {
            fetchPayslips();
        }
    }, [isAuthenticated, token, user]);

    const fetchPayslips = async () => {
        if (!token) return;

        setPayslipsLoading(true);
        setPayslipsError(null);

        try {
            const response = await payslipsApi.getPayslipsList(token);
            setPayslips(response.data.payslips);
        } catch (error) {
            console.error('Error fetching payslips:', error);
            setPayslipsError('Failed to load payslips');
        } finally {
            setPayslipsLoading(false);
        }
    };

    const handlePayslipDownload = async (payslip: Payslip) => {
        if (!token || !user) return;

        try {
            await payslipsApi.downloadAndSavePayslip(token, {
                filename: payslip.filename,
                year: payslip.year,
                month_id: payslip.month_id,
                month_name: payslip.month_name,
                employee_id: payslip.employee_id,
            });
        } catch (error) {
            console.error('Error downloading payslip:', error);
            // You could add a toast notification here
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg
                        className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const employeeType =
        user.contract_details && user.contract_details.length > 0
            ? user.contract_details.some((c) => c.type === 'fulltime')
                ? 'Fulltime'
                : 'Contractual'
            : 'Not specified';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-0">
                        <div className="flex items-center gap-4 py-3">
                            <Image
                                src="/saa-logo.png"
                                alt="Saaki Argus Averil logo"
                                width={120}
                                height={60}
                                className="hidden lg:block h-12 w-auto"
                                priority
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Employee Portal
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Welcome back, {user.fullname}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 1. Employee Details */}
                        <CollapsibleSection
                            title="Employee Details"
                            isOpen={isEmployeeOpen}
                            onToggle={() => setIsEmployeeOpen(!isEmployeeOpen)}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Employee Name
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{user.fullname}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Employee ID
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Official Email
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Designation
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.designation || 'Not provided'}
                                    </p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400">
                                        Reporting To (Manager)
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.reporting_manager
                                            ? `${user.reporting_manager.fullname} (${user.reporting_manager.username})`
                                            : 'Not assigned'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Date of Joining
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.date_joining
                                            ? formatDate(user.date_joining)
                                            : 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Employee Type
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{employeeType}</p>
                                </div>
                            </div>
                        </CollapsibleSection>

                        {/* 2. Contract Details */}
                        {user.contract_details &&
                            user.contract_details.length > 0 &&
                            user.contract_details[0].type === 'client_staffing' && (
                                <CollapsibleSection
                                    title="Contract Details"
                                    isOpen={isContractOpen}
                                    onToggle={() => setIsContractOpen(!isContractOpen)}
                                >
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm bg-white border border-gray-200 rounded-lg shadow-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-center align-middle font-semibold text-gray-700 border-b border-gray-200">
                                                        Location Deployed
                                                    </th>
                                                    <th className="px-4 py-2 text-center align-middle font-semibold text-gray-700 border-b border-gray-200">
                                                        Extension No.
                                                    </th>
                                                    <th className="px-4 py-2 text-center align-middle font-semibold text-gray-700 border-b border-gray-200">
                                                        Duration
                                                    </th>
                                                    <th className="px-4 py-2 text-center align-middle font-semibold text-gray-700 border-b border-gray-200">
                                                        Start date
                                                    </th>
                                                    <th className="px-4 py-2 text-center align-middle font-semibold text-gray-700 border-b border-gray-200">
                                                        End date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {user.contract_details.map((contract, index) =>
                                                    contract.type === 'client_staffing' ? (
                                                        <tr
                                                            key={index}
                                                            className="odd:bg-white even:bg-gray-50"
                                                        >
                                                            <td className="px-4 py-2 text-gray-900 border-b border-gray-100 text-center">
                                                                {contract.deputation_location || ''}
                                                            </td>
                                                            <td className="px-4 py-2 text-gray-900 border-b border-gray-100 text-center">
                                                                {contract.extension_number || ''}
                                                            </td>
                                                            <td className="px-4 py-2 text-gray-900 border-b border-gray-100 text-center">
                                                                {contract.duration || ''}
                                                            </td>
                                                            <td className="px-4 py-2 text-gray-900 border-b border-gray-100 text-center">
                                                                {formatDate(contract.date_start)}
                                                            </td>
                                                            <td className="px-4 py-2 text-gray-900 border-b border-gray-100 text-center">
                                                                {contract.date_end
                                                                    ? formatDate(contract.date_end)
                                                                    : ''}
                                                            </td>
                                                        </tr>
                                                    ) : null
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CollapsibleSection>
                            )}

                        {/* 3. Personal Details */}
                        <CollapsibleSection
                            title="Personal Details"
                            isOpen={isPersonalOpen}
                            onToggle={() => setIsPersonalOpen(!isPersonalOpen)}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Date of Birth
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.birth_date
                                            ? formatDate(user.birth_date)
                                            : 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Personal Email
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.email_personal || 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Contact
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.contact || 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Emergency Contact
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.contact_emergency || 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        PAN Number
                                    </label>
                                    <RedactedField className="mt-1" value={user.number_pan} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Aadhaar Number
                                    </label>
                                    <RedactedField className="mt-1" value={user.number_aadhaar} />
                                </div>
                            </div>
                        </CollapsibleSection>

                        {/* 4. Address & Communication Details */}
                        <CollapsibleSection
                            title="Address & Communication Details"
                            isOpen={isAddressOpen}
                            onToggle={() => setIsAddressOpen(!isAddressOpen)}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Communication Address
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.address_communication || 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Permanent Address
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.address_permanent || 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        </CollapsibleSection>

                        {/* Bank Details */}
                        {user.details_bank && (
                            <CollapsibleSection
                                title="Bank Details"
                                isOpen={isBankOpen}
                                onToggle={() => setIsBankOpen(!isBankOpen)}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            Account Holder Name
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_bank.name_account}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            Account Number
                                        </label>
                                        <RedactedField
                                            className="mt-1"
                                            value={user.details_bank.account_number}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            IFSC Code
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_bank.ifsc_code}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            Branch
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_bank.branch}
                                        </p>
                                    </div>
                                </div>
                            </CollapsibleSection>
                        )}

                        {/* PF Details */}
                        {user.details_pf && (
                            <CollapsibleSection
                                title="PF Details"
                                isOpen={isPFOpen}
                                onToggle={() => setIsPFOpen(!isPFOpen)}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            Name (in Aadhaar)
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_pf.name_aadhar}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            UAN Number
                                        </label>
                                        <RedactedField
                                            className="mt-1"
                                            value={user.details_pf.number_uan}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            PF Number
                                        </label>
                                        <RedactedField
                                            className="mt-1"
                                            value={user.details_pf.number_pf}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            ESI Number
                                        </label>
                                        <RedactedField className="mt-1" value={user.number_esi} />
                                    </div>
                                </div>
                            </CollapsibleSection>
                        )}

                        {/* Education Details */}
                        {user.details_education && user.details_education.length > 0 && (
                            <CollapsibleSection
                                title="Education Details"
                                isOpen={isEducationOpen}
                                onToggle={() => setIsEducationOpen(!isEducationOpen)}
                            >
                                <div className="space-y-4">
                                    {user.details_education?.map((education, index) => (
                                        <div
                                            key={education?.id || index}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-100 rounded-lg p-4"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400">
                                                    Highest Qualification
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {education?.highest_qualification ||
                                                        'Not provided'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400">
                                                    Institution
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {education?.institution_name || 'Not provided'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400">
                                                    Location
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {education?.location || 'Not provided'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400">
                                                    Degree
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {education?.degree || 'Not provided'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400">
                                                    Grade
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {education?.grade || 'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleSection>
                        )}

                        {/* Previous Employment */}
                        {user.details_previous_employment &&
                            user.details_previous_employment.length > 0 && (
                                <CollapsibleSection
                                    title="Previous Employment"
                                    isOpen={isPreviousEmploymentOpen}
                                    onToggle={() =>
                                        setIsPreviousEmploymentOpen(!isPreviousEmploymentOpen)
                                    }
                                >
                                    <div className="space-y-4">
                                        {user.details_previous_employment?.map(
                                            (employment, index) => (
                                                <div
                                                    key={employment?.id || index}
                                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-100 rounded-lg p-4"
                                                >
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-400">
                                                            Company
                                                        </label>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {employment?.company_name ||
                                                                'Not provided'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-400">
                                                            Designation
                                                        </label>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {employment?.designation ||
                                                                'Not provided'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-400">
                                                            Start Date
                                                        </label>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {employment?.date_start
                                                                ? formatDate(employment.date_start)
                                                                : 'Not provided'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-400">
                                                            End Date
                                                        </label>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {employment?.date_end
                                                                ? formatDate(employment.date_end)
                                                                : 'Not provided'}
                                                        </p>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-400">
                                                            Location
                                                        </label>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {employment?.location || 'Not provided'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CollapsibleSection>
                            )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Documents */}
                        {user.documents && user.documents.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Documents
                                </h2>
                                <div
                                    className={`space-y-3 ${user.documents.length > 6 ? 'max-h-96 overflow-y-auto pr-2' : ''}`}
                                >
                                    {user.documents.map((document) => (
                                        <DocumentCard key={document.id} document={document} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payslips */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payslips</h2>
                            {payslipsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <svg
                                        className="animate-spin h-6 w-6 text-green-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    <span className="ml-2 text-sm text-gray-600">
                                        Loading payslips...
                                    </span>
                                </div>
                            ) : payslipsError ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-red-600 mb-2">{payslipsError}</p>
                                    <button
                                        onClick={fetchPayslips}
                                        className="text-sm text-green-600 hover:text-green-700 underline"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : payslips.length > 0 ? (
                                <div
                                    className={`space-y-3 ${payslips.length > 6 ? 'max-h-96 overflow-y-auto pr-2' : ''}`}
                                >
                                    {payslips.map((payslip) => (
                                        <PayslipCard
                                            key={`${payslip.year}-${payslip.month_id}`}
                                            payslip={payslip}
                                            onDownload={handlePayslipDownload}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg
                                        className="w-12 h-12 text-gray-400 mx-auto mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <p className="text-sm text-gray-500">No payslips available</p>
                                </div>
                            )}
                        </div>

                        {/* Direct Reports */}
                        {user.direct_reports && user.direct_reports.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Direct Reports
                                </h2>
                                <div
                                    className={`space-y-2 ${user.direct_reports.length > 8 ? 'max-h-72 overflow-y-auto pr-2' : ''}`}
                                >
                                    {user.direct_reports.map((report) => (
                                        <div
                                            key={report.id}
                                            className="flex items-center justify-between py-1"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {report.fullname}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {report.username}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <p className="mt-4 text-xs text-gray-500 text-center">
                    Contact the admin / mail to{' '}
                    <a
                        href="mailto:jobs@saaconsulting.co.in"
                        className="text-blue-600 hover:underline"
                    >
                        jobs@saaconsulting.co.in
                    </a>{' '}
                    for any changes in personal details.
                </p>
            </div>
        </div>
    );
}
