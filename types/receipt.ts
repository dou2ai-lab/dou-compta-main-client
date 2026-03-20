/**
 * Strict extraction schema for receipt data (matches backend ReceiptDataStrict / Gemini output).
 * Used to auto-fill the Expense Details form.
 */
export type ReceiptData = {
  merchantName: string
  address: string
  date: string
  time: string
  invoiceNumber: string
  items: { name: string; price: number }[]
  subtotal: number
  vatAmount: number
  vatRate: number
  totalAmount: number
  currency: string
  paymentMethod: string
  description: string
  category: string
}

/** Backend returns snake_case (merchant_name, expense_date, etc.) */
export type ReceiptExtractionFromAPI = {
  document_type?: string | null
  merchant_name?: string | null
  merchant_address?: string | null
  expense_date?: string | null
  invoice_number?: string | null
  subtotal?: number | null
  total_amount?: number | null
  vat_amount?: number | null
  vat_rate?: number | null
  currency?: string | null
  payment_method?: string | null
  description?: string | null
  category?: string | null
  others?: string[] | null
  status?: string | null
  overall_confidence?: number | null
  confidence_scores?: Record<string, number> | null
  field_sources?: Record<string, string> | null
  field_reasoning?: Record<string, string> | null
  bank_statement?: Record<string, unknown> | null
  payslip?: Record<string, unknown> | null
  line_items?: Array<{
    description?: string
    name?: string
    price?: number
    amount?: number
    quantity?: number
    unit_price?: number
    vat_rate?: number
  }> | null
  [key: string]: unknown
}

/** OCR block in meta_data (regex/fallback extraction) */
export type ReceiptOcrFromAPI = {
  text?: string
  currency?: string | null
  total_amount?: number | null
  merchant_name?: string | null
  expense_date?: string | null
  [key: string]: unknown
}

/** Response from POST /api/v1/receipts/extract (full pipeline: OCR → classify → extract) */
export type ReceiptExtractAPIResponse = {
  document_type?: string
  ocr_text?: string
  ocr_confidence?: number | null
  raw_extraction?: {
    supplier?: string | null
    merchant_name?: string | null
    invoice_number?: string | null
    invoice_date?: string | null
    expense_date?: string | null
    vat_amount?: number | null
    total_amount?: number | null
    currency?: string | null
    vat_rate?: number | null
    [key: string]: unknown
  }
  supplier?: string | null
  invoice_number?: string | null
  invoice_date?: string | null
  vat_amount?: number | null
  total_amount?: number | null
  currency?: string | null
}

/** Receipt API response (GET /receipts/:id or upload response with meta_data) */
export type ReceiptAPIResponse = {
  receipt_id?: string
  id?: string
  status?: string
  ocr_status?: string
  meta_data?: {
    ocr?: ReceiptOcrFromAPI | null
    extraction?: ReceiptExtractionFromAPI | null
    pipeline_error?: string
  } | null
  extracted_data?: ReceiptOcrFromAPI | ReceiptExtractionFromAPI | null
}
