export enum TypeLayout {
  Grid,
  List
}

export interface IndustryIdentifiersInterface {
  type: string
  identifier: string
}

export interface IVolumeInfo {
  title: string
  subtitle?: string
  authors: Array<string>
  publisher?: string
  publishedDate: string
  description?: string
  industryIdentifiers: IndustryIdentifiersInterface[]
  readingModes: {
    text: boolean
    image: boolean
  }
  pageCount: number
  printType: string
  categories?: string[]
  averageRating?: number
  ratingsCount?: number
  maturityRating: string
  allowAnonLogging: boolean
  contentVersion: string
  panelizationSummary: {
    containsEpubBubbles: false
    containsImageBubbles: false
  }
  imageLinks?: {
    smallThumbnail?: string
    thumbnail?: string
    small?: string
    medium?: string
    large?: string
    extraLarge?: string
  }
  language: string
  previewLink: string
  infoLink: string
  canonicalVolumeLink: string
}

export interface IAccessInfo {
  country: string
  viewability: string
  embeddable: boolean
  publicDomain: boolean
  textToSpeechPermission: string
  epub: {
    isAvailable: boolean
    downloadLink?: string
  }
  pdf: {
    isAvailable: boolean
    downloadLink?: string
  }
  webReaderLink: string
  accessViewStatus: string
  quoteSharingAllowed: boolean
}

export interface IBookApi {
  kind: string
  id: string
  etag: string
  selfLink: string
  volumeInfo: IVolumeInfo
  saleInfo: {
    country: string
    saleability: string
    isEbook: boolean
    buyLink?: string
    listPrice?: { amount: number; currencyCode: string }
    retailPrice?: { amount: number; currencyCode: string }
  }
  accessInfo: IAccessInfo
}

export interface IBook {
  id: string
  authors: string
  date: string
  country: string
  imgUrl: string
  title: string
}
