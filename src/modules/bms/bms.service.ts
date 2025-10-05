import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { BMSSearchResponseEntity } from './entities/bms-search.entity';

@Injectable()
export class BmsService {
  private readonly BMS_SEARCH_URL =
    'https://in.bookmyshow.com/quickbook-search.bms';

  async searchTheatres(query: string): Promise<BMSSearchResponseEntity> {
    const makeRequest = async () => {
      return axios.get<BMSSearchResponseEntity>(this.BMS_SEARCH_URL, {
        params: {
          cat: 'VN',
          q: query,
        },
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Accept: 'application/json, text/plain, */*',
        },
        timeout: 10000,
      });
    };

    try {
      const response = await makeRequest();
      return response.data;
    } catch (firstError) {
      // Retry once if first request fails with 403 or other errors
      if (axios.isAxiosError(firstError)) {
        try {
          const retryResponse = await makeRequest();
          return retryResponse.data;
        } catch (retryError) {
          if (axios.isAxiosError(retryError)) {
            throw new HttpException(
              `Failed to search theatres after retry: ${retryError.message}`,
              retryError.response?.status || HttpStatus.BAD_GATEWAY,
            );
          }
          throw new HttpException(
            'An unexpected error occurred while searching theatres',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
      throw new HttpException(
        'An unexpected error occurred while searching theatres',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
