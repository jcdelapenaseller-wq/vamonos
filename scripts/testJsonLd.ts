import * as fs from 'fs';

const auction = {
  boeId: 'SUB-EJ-1234',
  propertyType: 'piso',
  appraisalValue: 100000,
  claimedDebt: 50000,
  address: 'Calle Falsa 123',
  status: 'closed',
  publishedAt: '2024-01-01T00:00:00Z',
  lastCheckedAt: '2024-02-01T00:00:00Z',
  imageUrl: '/img/test.jpg'
};
const auctionResult = {
  finalPrice: 75000
};
const cityName = 'Madrid';
const provinceName = 'Madrid';
const cleanSlug = 'subasta-madrid';
const analysisInsights = {
  marketContext: 'Buen mercado.',
  investorProfile: 'Inversor medio.'
};
const isFinished = true;

const propertyType = 'Piso';
const discount = auction?.appraisalValue && auction?.claimedDebt 
  ? Math.round((1 - (auction.claimedDebt / (auction?.appraisalValue ?? 0))) * 100) 
  : 0;

const streetPart = ' (Calle Falsa 123)';

let discountPart = '';
if (auction?.claimedDebt === 0) {
  discountPart = ' (Sin cargas declaradas)';
} else if (discount > 85) {
  discountPart = ' (Oportunidad a analizar)';
} else if (discount > 0) {
  discountPart = ` con ${discount}% de descuento`;
}

const title = `${propertyType} en subasta en ${cityName}${streetPart}${discountPart}`;
const finalTitle = title.length > 70 ? title.substring(0, 67) + '...' : title;

const description = analysisInsights 
  ? `${analysisInsights.marketContext} ${analysisInsights.investorProfile}`.substring(0, 160) + '...'
  : `Subasta de ${propertyType.toLowerCase()} en ${cityName}, ${provinceName}.`;

const imageUrl = auction?.imageUrl && auction.imageUrl.startsWith('http') 
  ? auction.imageUrl 
  : auction?.imageUrl 
    ? `https://activosoffmarket.es${auction.imageUrl.startsWith('/') ? '' : '/'}${auction.imageUrl}` 
    : "https://activosoffmarket.es/og-image.png";

const price = auctionResult?.finalPrice ?? auction?.claimedDebt ?? auction?.appraisalValue ?? 0;
const url = "https://activosoffmarket.es/subasta/subasta-madrid";

const now = new Date();
let publishedDate = auction?.publishedAt ? new Date(auction.publishedAt) : now;
if (publishedDate > now) publishedDate = now;

const dateCandidates = [
  auction?.lastCheckedAt,
  auction?.publishedAt
].filter(Boolean) as string[];

const validDates = dateCandidates
  .map(d => new Date(d))
  .filter(d => !isNaN(d.getTime()));

const dateModified = validDates.length > 0 
  ? new Date(Math.max(...validDates.map(d => d.getTime()))).toISOString()
  : publishedDate.toISOString();

const availability = isFinished 
  ? "https://schema.org/SoldOut" 
  : auction?.status === 'suspended'
    ? "https://schema.org/LimitedAvailability"
    : auction?.status === 'upcoming'
      ? "https://schema.org/PreOrder"
      : "https://schema.org/InStock";

const product: any = {
  "@context": "https://schema.org",
  "@type": "Product",
  "sku": auction.boeId,
  "productID": auction.boeId,
  "name": finalTitle,
  "description": description,
  "image": imageUrl,
  "category": propertyType,
  "brand": {
    "@type": "Brand",
    "name": "Activos Off-Market"
  },
  "dateModified": dateModified,
  "offers": {
    "@type": "Offer",
    "price": price,
    "priceCurrency": "EUR",
    "availability": availability,
    "url": url,
    "itemCondition": "https://schema.org/UsedCondition"
  },
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Tipo de Inmueble",
      "value": propertyType
    },
    {
      "@type": "PropertyValue",
      "name": "Ciudad",
      "value": cityName
    },
    {
      "@type": "PropertyValue",
      "name": "Descuento",
      "value": `${discount}%`
    }
  ]
};

console.log(JSON.stringify(product, null, 2));
