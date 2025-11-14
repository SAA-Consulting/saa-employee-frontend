// Types based on Strapi schema from backend
export interface StrapiMediaFormat {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    path?: string | null;
    width?: number | null;
    height?: number | null;
    size?: number | null;
    sizeInBytes?: number | null;
    url: string;
}

export interface StrapiMediaFormats {
    thumbnail?: StrapiMediaFormat | null;
    small?: StrapiMediaFormat | null;
}

export interface StrapiMedia {
    id: number;
    name: string;
    alternativeText?: string | null;
    caption?: string | null;
    width?: number | null;
    height?: number | null;
    formats?: StrapiMediaFormats | null;
    hash: string;
    ext: string;
    mime: string;
    size?: number | null;
    url: string;
    previewUrl?: string | null;
    provider: string;
    provider_metadata?: any | null;
    createdAt: string;
    updatedAt: string;
}

// Component Types
export interface StrapiDetailsEducation {
    id: number;
    highest_qualification: 'School 10th' | 'School 12th' | 'Diploma' | 'UG' | 'PG';
    institution_name: string;
    location: string;
    degree: string;
    grade: string;
}

export interface StrapiDetailsPreviousEmployment {
    id: number;
    company_name: string;
    designation: string;
    date_start: string;
    date_end: string;
    location: string;
}

export interface StrapiDetailsBank {
    id: number;
    name_account: string;
    account_number: string;
    ifsc_code: string;
    branch: string;
    cancelled_cheque?: StrapiMedia | null;
}

export interface StrapiDetailsPF {
    id: number;
    name_aadhar: string;
    number_uan: string;
    number_pf: string;
}

export interface StrapiEmployeeFulltime {
    __component: 'user.employee-fulltime';
    id: number;
    type: 'fulltime';
    date_start: string;
    date_end?: string | null;
}

export interface StrapiEmployeeClientStaffing {
    __component: 'user.employee-client-staffing';
    id: number;
    type: 'client_staffing';
    date_start: string;
    date_end?: string | null;
    duration?: string | null;
    deputation_location?: string | null;
    deputation_client?: string | null;
    extension_details?: StrapiMedia[] | null;
}

// Main User Types
export interface StrapiUserType {
    id: number;
    username: string;
    email: string;
    provider?: string | null;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    fullname: string;
    email_personal?: string | null;
    contact?: string | null;
    contact_emergency?: string | null;
    address_communication?: string | null;
    address_permanent?: string | null;
    date_joining?: string | null;
    designation?: string | null;
    number_pan?: string | null;
    number_esi?: string | null;
}

export interface StrapiUserFullType extends StrapiUserType {
    details_education?: StrapiDetailsEducation | null;
    details_previous_employment?: StrapiDetailsPreviousEmployment | null;
    details_bank?: StrapiDetailsBank | null;
    details_pf?: StrapiDetailsPF | null;
    contract_details?: (StrapiEmployeeFulltime | StrapiEmployeeClientStaffing)[] | null;
    documents?: StrapiMedia[] | null;
    documents_invisible?: StrapiMedia[] | null;
}

// API Response Types
export interface LoginRequest {
    identifier: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
        jwt: string;
        user: StrapiUserType;
    };
    message: string;
}

export interface MeResponse {
    success: boolean;
    data: StrapiUserFullType;
    message: string;
}

export interface ApiError {
    success: false;
    message: string;
    error?: any;
}

// Payslip Types
export interface Payslip {
    filename: string;
    file_path: string;
    employee_id: string;
    year: number;
    month_id: number;
    month_name: string;
    file_size: number;
    created_at: number;
    modified_at: number;
}

export interface PayslipsListResponse {
    success: boolean;
    data: {
        payslips: Payslip[];
        employee_id: string;
    };
    message: string;
}

export interface PayslipDownloadRequest {
    filename: string;
    year: number;
    month_id: number;
    month_name: string;
    employee_id: string;
}
