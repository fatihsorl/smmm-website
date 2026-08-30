export const ALIS_TURLERI = [
  { kod: "1", ad: "Normal Alım" },
  { kod: "2", ad: "Satıştan İade" },
] as const;

export const GIDER_KAYIT_TURLERI = [
  { kod: "1", ad: "Mal Alışı" },
  { kod: "4", ad: "İndirilecek Giderler (GVK Md. 40)" },
  { kod: "5", ad: "Gider Kabul Edilmeyen Ödemeler (GVK Md. 41)" },
  { kod: "13", ad: "Sabit Kıymet Alışı" },
] as const;

export const GIDER_KAYIT_ALT_TURLERI = [
  { kod: "186", ust: "1", ad: "Mal Alışı" },
  { kod: "85", ust: "4", ad: "Normal Bakım Onarım Giderleri (GVK 40/1 - 40/7)" },
  { kod: "89", ust: "4", ad: "Ofis Giderleri (Çay, Kahve, Şeker, Temizlik vb.) (GVK 40/1)" },
  { kod: "90", ust: "4", ad: "Gıda Harcamaları (GVK 40/1-40/2)" },
  { kod: "95", ust: "4", ad: "Kırtasiye ve Basılı Evrak Giderleri (GVK 40/1)" },
  { kod: "97", ust: "4", ad: "Temsil ve Ağırlama Gideri (İş yemeği vb.) (GVK 40/1)" },
  { kod: "112", ust: "4", ad: "Ulaşım Giderleri (Oto Kiralama, Taksi, Uçak vb) (GVK 40/4-5)" },
  { kod: "113", ust: "4", ad: "Taşıt Akaryakıt Giderleri (GVK 40/1-40/5)" },
  { kod: "114", ust: "4", ad: "Taşıt Bakım Onarım Giderleri (GVK 40/5)" },
  { kod: "162", ust: "4", ad: "Diğer (GVK 40/1)" },
  { kod: "172", ust: "4", ad: "Yıllara Yaygın İnşaat Maliyetleri" },
  { kod: "185", ust: "4", ad: "Doğrudan Gider Yazılan Demirbaş (GVK 40/1)" },
  { kod: "189", ust: "4", ad: "Seyahat ve Ulaşım Giderleri (Oto Kiralama, Otobüs, Taksi, Uçak vb) (GVK 40/4-5)" },
  { kod: "191", ust: "4", ad: "Otopark Gideri (GVK Md. 40/5)" },
  { kod: "194", ust: "4", ad: "Dışarıdan Sağlanan Fayda ve Hizmetler (GVK 40/1)" },
  { kod: "228", ust: "4", ad: "Diğer Sarf Malzeme Giderleri (GVK 40/1)" },
  { kod: "324", ust: "4", ad: "Otoyol ve Gişe Giderleri (OGS, HGS vb.) (GVK 40/4-5)" },
  { kod: "158", ust: "5", ad: "İlişkili kişilerle emsallere uygunluk ilkesine aykırı giderler" },
  { kod: "201", ust: "5", ad: "Diğer K.K.E.G. (Diğer, SGK Primleri)" },
  { kod: "221", ust: "5", ad: "KDV Kanunu Md. 30/d Uyarınca İndirilemeyen KDV Tutarı" },
  { kod: "238", ust: "5", ad: "İşsizlik Sigortası Fonu’ndan Karşılanan Sigorta Primleri" },
  { kod: "239", ust: "5", ad: "Hazine Tarafından Karşılanan Özürlü Personelin Sigorta Primi" },
  { kod: "240", ust: "5", ad: "Kayıp ve Zayi Olan Mallara Ait Giderler" },
  { kod: "241", ust: "5", ad: "Esas faaliyet konusu dışı deniz/hava taşıtı giderleri" },
  { kod: "253", ust: "13", ad: "Amortisman Giderleri (GVK 40/7)" },
  { kod: "256", ust: "13", ad: "Esas faaliyet konusu dışı vasıta amortismanları" },
  { kod: "257", ust: "13", ad: "VUK Hükümlerine Aykırı Olarak Ayrılan Amortismanlar" },
  { kod: "501", ust: "13", ad: "Esas faaliyet konusu dışı deniz/hava taşıtı amortismanları" },
] as const;

export const KDV_ORANLARI = [0, 1, 10, 20] as const;

export const DEFAULT_ALIS_TURU = "1";
export const DEFAULT_GIDER_KAYIT_TURU = "4";
export const DEFAULT_GIDER_ALT_TURU = "162";
