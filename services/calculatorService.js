export function hitungKetahananAir(kebutuhanHarian, totalCadangan) {
  if (!kebutuhanHarian || kebutuhanHarian === 0) return 0;
  return totalCadangan / kebutuhanHarian;
}