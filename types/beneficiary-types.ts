export interface BeneficiaryData {
  id: number
  account_number: string
  bank_code: string
  full_name: string
  created_at: string
  bank_name: string
}

export interface BeneficiaryListResponse {
  status: string
  message: string
  data: BeneficiaryData[]
  meta: {
    page_info: {
      total: number
      current_page: number
      total_pages: number
    }
  }
}

export interface BeneficiaryDetailResponse {
  status: string
  message: string
  data: BeneficiaryData
}

export interface DeleteBeneficiaryResponse {
  status: string
  message: string
  data: string
}

export interface TransferData {
  id: number
  account_number: string
  bank_code: string
  full_name: string
  created_at: string
  currency: string
  debit_currency: string
  amount: number
  fee: number
  status: string
  reference: string
  meta: string | null
  narration: string
  complete_message: string
  requires_approval: number
  is_approved: number
  bank_name: string
}

export interface TransferListResponse {
  status: string
  message: string
  data: TransferData[]
  meta: {
    page_info: {
      total: number
      current_page: number
      total_pages: number
    }
  }
}

export interface TransferDetailResponse {
  status: string
  message: string
  data: TransferData
}

export interface RetryTransferResponse {
  status: string
  message: string
  data: TransferData
}
