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
    onToggle 
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
            {isOpen && (
                <div className="px-6 pb-6">
                    {children}
                </div>
            )}
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

const PayslipCard = ({ payslip, onDownload }: { payslip: Payslip; onDownload: (payslip: Payslip) => void }) => {
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
    const [isPFOpen, setIsPFOpen] = useState(false);
    const [isContractOpen, setIsContractOpen] = useState(false);
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
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
                                <h1 className="text-2xl font-bold text-gray-900">Employee Portal</h1>
                                <p className="text-sm text-gray-600">Welcome back, {user.fullname}</p>
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
                    {/* Basic Info  */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Personal Details
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Full Name
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{user.fullname}</p>
                                </div>
                                <div></div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Email
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Personal Email
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.email_personal || 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Address & Contact Details
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-4">
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
                            </div>
                        </div>

                        {/* Employment Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Employment Details
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Designation
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.designation || 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Employee ID
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        PAN Number
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.number_pan || 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        ESI Number
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.number_esi || 'Not provided'}
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
                            </div>
                        </div>

                        {/* Bank Details */}
                        {user.details_bank && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Bank Details
                                </h2>
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
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_bank.account_number}
                                        </p>
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
                            </div>
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
                                            Aadhar Name
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_pf.name_aadhar}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            UAN Number
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_pf.number_uan}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            PF Number
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_pf.number_pf}
                                        </p>
                                    </div>
                                </div>
                            </CollapsibleSection>
                        )}

                        {/* Contract Details */}
                        {user.contract_details && user.contract_details.length > 0 && (
                            <CollapsibleSection
                                title="Contract Details"
                                isOpen={isContractOpen}
                                onToggle={() => setIsContractOpen(!isContractOpen)}
                            >
                                <div className="space-y-4">
                                    {user.contract_details.map((contract, index) => (
                                        <div key={index} className="">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400">
                                                        Type
                                                    </label>
                                                    <p className="mt-1 text-sm text-gray-900 capitalize">
                                                        {contract.type.replace('_', ' ')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400">
                                                        Start Date
                                                    </label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {formatDate(contract.date_start)}
                                                    </p>
                                                </div>
                                                {contract.date_end && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-400">
                                                            End Date
                                                        </label>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {formatDate(contract.date_end)}
                                                        </p>
                                                    </div>
                                                )}
                                                {contract.__component ===
                                                    'user.employee-client-staffing' && (
                                                    <>
                                                        {contract.duration && (
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-400">
                                                                    Duration
                                                                </label>
                                                                <p className="mt-1 text-sm text-gray-900">
                                                                    {contract.duration}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {contract.deputation_location && (
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-400">
                                                                    Deputation Location
                                                                </label>
                                                                <p className="mt-1 text-sm text-gray-900">
                                                                    {contract.deputation_location}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {contract.deputation_client && (
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-400">
                                                                    Deputation Client
                                                                </label>
                                                                <p className="mt-1 text-sm text-gray-900">
                                                                    {contract.deputation_client}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleSection>
                        )}

                        {/* Education Details */}
                        {user.details_education && (
                            <CollapsibleSection
                                title="Education Details"
                                isOpen={isEducationOpen}
                                onToggle={() => setIsEducationOpen(!isEducationOpen)}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            Highest Qualification
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_education.highest_qualification}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            Institution
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_education.institution_name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            Location
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_education.location}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            Degree
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_education.degree}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            Grade
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_education.grade}
                                        </p>
                                    </div>
                                </div>
                            </CollapsibleSection>
                        )}

                        {/* Previous Employment */}
                        {user.details_previous_employment && (
                            <CollapsibleSection
                                title="Previous Employment"
                                isOpen={isPreviousEmploymentOpen}
                                onToggle={() => setIsPreviousEmploymentOpen(!isPreviousEmploymentOpen)}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            Company
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_previous_employment.company_name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            Designation
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_previous_employment.designation}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            Start Date
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {formatDate(
                                                user.details_previous_employment.date_start
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">
                                            End Date
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {formatDate(user.details_previous_employment.date_end)}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400">
                                            Location
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {user.details_previous_employment.location}
                                        </p>
                                    </div>
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
                                <div className={`space-y-3 ${user.documents.length > 6 ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
                                    {user.documents.map((document) => (
                                        <DocumentCard key={document.id} document={document} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payslips */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Payslips
                            </h2>
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
                                    <span className="ml-2 text-sm text-gray-600">Loading payslips...</span>
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
                                <div className={`space-y-3 ${payslips.length > 6 ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
