import { computed, reactive, ref } from 'vue'
import type { Product, ProductRequest } from '@/types/product'
import { createProduct, updateProduct, uploadProductImage } from '@/services/product.service'

export interface ProductFormState {
  productName: string
  catId: number | null
  price: number | null
  sQty: number | null
  expiredDate: string
  description: string
  status: boolean
}

const emptyForm = (): ProductFormState => ({
  productName: '',
  catId: null,
  price: null,
  sQty: null,
  expiredDate: '',
  description: '',
  status: true,
})

export function useProductForm(existing?: Product) {
  const form = reactive<ProductFormState>(
    existing
      ? {
          productName: existing.productName,
          catId: existing.catId,
          price: existing.price,
          sQty: existing.sQty,
          expiredDate: existing.expiredDate,
          description: existing.description,
          status: existing.status,
        }
      : emptyForm(),
  )

  const imageFile = ref<File | null>(null)
  const imagePreview = ref<string | null>(
    existing?.imageUrl ? `http://localhost:8080${existing.imageUrl}` : null,
  )

  const saving = ref(false)
  const error = ref<string | null>(null)
  const fieldErrors = reactive<Record<string, string>>({})

  const isEdit = computed(() => !!existing)

  const handleImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }

  const validate = () => {
    Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key])

    if (!form.productName.trim()) fieldErrors.productName = 'Product name is required.'
    if (!form.catId) fieldErrors.catId = 'Select a category.'
    if (form.price === null || form.price <= 0) fieldErrors.price = 'Enter a valid price.'
    if (form.sQty === null || form.sQty < 0) fieldErrors.sQty = 'Enter a valid stock quantity.'
    if (!form.expiredDate) fieldErrors.expiredDate = 'Select an expiry date.'

    return Object.keys(fieldErrors).length === 0
  }

  const submit = async (): Promise<Product | null> => {
    error.value = null
    if (!validate()) return null

    saving.value = true
    try {
      const payload: ProductRequest = {
        productName: form.productName.trim(),
        catId: form.catId as number,
        price: form.price as number,
        sQty: form.sQty as number,
        expiredDate: form.expiredDate,
        description: form.description.trim(),
        status: form.status,
      }

      let saved: Product = isEdit.value
        ? await updateProduct(existing!.pid, payload)
        : await createProduct(payload)

      if (imageFile.value) {
        saved = await uploadProductImage(saved.pid, imageFile.value)
      }

      return saved
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save product.'
      return null
    } finally {
      saving.value = false
    }
  }

  return {
    form,
    imageFile,
    imagePreview,
    saving,
    error,
    fieldErrors,
    isEdit,
    handleImageChange,
    submit,
  }
}
