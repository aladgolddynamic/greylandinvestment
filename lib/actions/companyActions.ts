'use server';

import { companyService } from '@/services/companyService';
import { CompanyInfo } from '@/types/company';
import { revalidatePath } from 'next/cache';

export async function getCompanyInfoAction() {
    return await companyService.getInfo();
}

export async function updateCompanyInfoAction(data: CompanyInfo) {
    const info = await companyService.updateInfo(data);
    revalidatePath('/admin/dashboard/company');
    revalidatePath('/');
    return info;
}

export async function getCompanyBrandingAction() {
    return await companyService.getBranding();
}
