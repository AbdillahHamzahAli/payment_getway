import { Pageable } from "../model/page";
import {
  CreateProductRequest,
  ProductResponse,
  SearchProductRequest,
  toProductResponse,
} from "../model/product-model";
import { ProductRepository } from "../repository/product-repository";
import { ProductValidation } from "../validation/product-validation";
import { Validation } from "../validation/validation";

export class ProductService {
  static async createProduct(
    request: CreateProductRequest
  ): Promise<ProductResponse> {
    const createRequest = Validation.validate(
      ProductValidation.CREATE,
      request
    );

    const product = await ProductRepository.createProduct(createRequest);

    return toProductResponse(product);
  }

  static async searchProduct(
    request: SearchProductRequest
  ): Promise<Pageable<ProductResponse>> {
    const searchRequest = Validation.validate(
      ProductValidation.SEARCH,
      request
    );
    const skip = (searchRequest.page - 1) * searchRequest.size;
    const take = searchRequest.size;

    const products = await ProductRepository.searchProduct(
      searchRequest.name ?? "",
      skip,
      take
    );

    const total = await ProductRepository.countProduct(
      searchRequest.name ?? ""
    );

    return {
      data: products.map((product) => toProductResponse(product)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / take),
        size: searchRequest.size,
      },
    };
  }
}
