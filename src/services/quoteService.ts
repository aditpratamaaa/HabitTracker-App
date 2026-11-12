import type { ApiResponse } from '../types/api';
import type { Quote, QuotesResponse } from '../types/quote';
import { delay } from '../utils/delay';

const RANDOM_QUOTE_ENDPOINT = 'https://dummyjson.com/quotes/random';
const QUOTES_LIST_ENDPOINT = 'https://dummyjson.com/quotes?limit=10';

/**
 * Type Guard untuk memastikan payload JSON dari REST API memenuhi kontrak interface Quote
 * tanpa menggunakan tipe `any`.
 */
function isValidQuote(payload: unknown): payload is Quote {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }
  const candidate = payload as Record<string, unknown>;
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.quote === 'string' &&
    typeof candidate.author === 'string'
  );
}

/**
 * 1. Fungsi Berbasis Promise Constructor (`new Promise`, `resolve`, dan `reject`)
 * Mengambil 1 kutipan acak dari External Public REST API DummyJSON.
 *
 * @param simulateDelayMs - Opsional penundaan tambahan dalam milidetik
 * @returns Promise<Quote>
 */
export function fetchRandomQuoteWithPromise(simulateDelayMs: number = 0): Promise<Quote> {
  return new Promise<Quote>((resolve, reject) => {
    const executeFetch = () => {
      fetch(RANDOM_QUOTE_ENDPOINT)
        .then((response) => {
          if (!response.ok || response.status !== 200) {
            reject(new Error('Gagal mengambil kutipan dari server.'));
            return null;
          }
          return response.json() as Promise<unknown>;
        })
        .then((data) => {
          if (!data) return;
          if (!isValidQuote(data)) {
            reject(new Error('Format data kutipan dari server tidak valid.'));
            return;
          }
          resolve(data as Quote);
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error
              ? error.message
              : 'Terjadi gangguan jaringan saat menghubungi server kutipan.';
          reject(new Error(message));
        });
    };

    if (simulateDelayMs > 0) {
      setTimeout(executeFetch, simulateDelayMs);
    } else {
      executeFetch();
    }
  });
}

/**
 * 2. Fungsi Alternatif Berbasis Method Chaining `.then()` & `.catch()`
 * serta Static Method `Promise.resolve()` dan `Promise.reject()`
 * Tanpa kata kunci `async/await` sesuai kriteria Modul 3 Bab 1.4.
 *
 * @returns Promise<Quote>
 */
export function fetchQuoteUsingThen(): Promise<Quote> {
  return fetch(RANDOM_QUOTE_ENDPOINT)
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(new Error('Gagal mengambil kutipan dari server.'));
      }
      return res.json() as Promise<unknown>;
    })
    .then((data) => {
      if (!isValidQuote(data)) {
        return Promise.reject(new Error('Struktur objek Quote tidak sesuai spesifikasi.'));
      }
      return Promise.resolve(data);
    })
    .catch((error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Gagal memuat kutipan menggunakan rantai Promise.';
      return Promise.reject(new Error(errorMessage));
    });
}

/**
 * 3. Fungsi Berbasis Custom Async/Await (`getDailyHabitQuote`)
 * Menggunakan `async/await`, memanggil custom promise `delay(600)` untuk
 * simulasi visual fetching, dan menerapkan blok `try...catch` lengkap.
 *
 * @returns Promise<Quote>
 */
export async function getDailyHabitQuote(): Promise<Quote> {
  try {
    // Simulasi visual fetching selama 600ms menggunakan custom Promise delay
    await delay(600);

    const quote = await fetchRandomQuoteWithPromise();
    return quote;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Tidak dapat memuat kutipan motivasi harian. Periksa koneksi internet Anda.';
    throw new Error(message);
  }
}

/**
 * 4. Fungsi Pembungkus Generic `ApiResponse<Quote>`
 * Mengembalikan hasil pemanggilan API dalam struktur standar `ApiResponse<T>` (Modul Hal. 20).
 */
export async function getDailyHabitQuoteResponse(): Promise<ApiResponse<Quote>> {
  try {
    const quote = await getDailyHabitQuote();
    return {
      success: true,
      data: quote,
      message: 'Kutipan motivasi harian berhasil dimuat.',
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Gagal memuat kutipan motivasi harian.';
    throw new Error(message);
  }
}

/**
 * 5. Fungsi Pengambil Daftar Kutipan (`QuotesResponse`)
 * Mendemonstrasikan pemetaan koleksi objek `Quote[]` ke dalam interface `QuotesResponse`.
 */
export async function fetchQuotesCollection(): Promise<QuotesResponse> {
  await delay(400);
  const response = await fetch(QUOTES_LIST_ENDPOINT);
  if (!response.ok) {
    throw new Error('Gagal mengambil daftar koleksi kutipan dari server.');
  }
  const data = (await response.json()) as QuotesResponse;
  return data;
}

