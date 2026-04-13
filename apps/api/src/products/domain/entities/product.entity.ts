export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string,
    public readonly price: number,
    public readonly categoryId: string,
    public readonly leadTime: number,
    public readonly isCustomizable: boolean,
    public readonly listPrice: number,
    public readonly cashDiscountPrice: number,
    public readonly inStock: boolean,
    public readonly requiresAssembly: boolean,
    public readonly materials?: string,
    public readonly dimensions?: string,
    public readonly structure?: string,
    public readonly finish?: string,
    public readonly fabric?: string,
    public readonly shippingWeight?: number,
    public readonly images: string[] = [],
    public readonly isFeatured: boolean = false,
    public readonly category?: Category,
  ) {}
}

export class Category {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
  ) {}
}
