export function currencyFormat(amount: number) {
  return "$" + (amount / 100).toFixed(2);
}


/** Untuk menghapus filter params yang kosong 
 * Contoh url?pageNumber=1&brands=&types
 * Menjadi url?pageNumber=1
**/
export function filterEmptyValues(values: object) {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) =>
        value != "" &&
        value !== null &&
        value !== undefined &&
        value.length !== 0
    )
  );
}
