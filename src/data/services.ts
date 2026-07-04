export type Service = {
  slug: string;
  title: string;
  description: string;
  image: string;
  details: string[];
  seoTitle: string;
  seoDescription: string;
  intro: string;
  sections: {
    title: string;
    paragraphs: string[];
  }[];
  benefits: string[];
};

export const services: Service[] = [
  {
    slug: "raporlama-hizmetleri",
    title: "Raporlama Hizmetleri",
    description:
      "Yönetimin doğru ve hızlı karar almasını sağlayan finansal raporlama altyapıları hazırlıyoruz.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=80",
    details: [
      "Yönetim raporları ve dönemsel finansal özetler",
      "Mali tablo analizi ve performans değerlendirmesi",
      "Nakit akış, bütçe ve karşılaştırmalı finans tabloları",
    ],
    seoTitle: "Raporlama Hizmetleri | Finansal Raporlama ve Yönetim Raporları",
    seoDescription:
      "Yönetim raporları, mali tablo analizi, nakit akış tabloları, bütçe raporları ve finansal performans değerlendirmeleri için profesyonel raporlama hizmetleri.",
    intro:
      "Raporlama hizmetleri, işletmelerin finansal durumunu daha net görmesini, karar süreçlerini veriye dayalı yönetmesini ve geleceğe dönük planlarını daha sağlıklı oluşturmasını sağlar. Soral Danışmanlık olarak finansal verileri yalnızca kayıt düzeyinde değil, yönetimin anlayabileceği ve aksiyon alabileceği raporlar haline getiriyoruz.",
    sections: [
      {
        title: "Yönetim Kararlarını Destekleyen Finansal Raporlama",
        paragraphs: [
          "İşletmelerde doğru karar almak için gelir, gider, maliyet, tahsilat, ödeme ve karlılık verilerinin düzenli olarak analiz edilmesi gerekir. Raporlama hizmetlerimiz kapsamında şirketin faaliyet yapısına uygun yönetim raporları, dönemsel finansal özetler ve karşılaştırmalı tablolar hazırlıyoruz.",
          "Hazırlanan raporlar sayesinde işletme sahipleri ve yöneticiler hangi alanlarda büyüme potansiyeli olduğunu, hangi gider kalemlerinin kontrol edilmesi gerektiğini ve nakit akışının hangi dönemlerde daha dikkatli yönetilmesi gerektiğini açık şekilde görebilir.",
        ],
      },
      {
        title: "Mali Tablo Analizi ve Performans Değerlendirmesi",
        paragraphs: [
          "Bilanço, gelir tablosu ve diğer finansal tablolar yalnızca yasal zorunluluklar için değil, şirketin gerçek performansını anlamak için de önemlidir. Mali tablo analizi ile şirketin likidite durumu, borçluluk yapısı, karlılık oranları ve sürdürülebilir büyüme kapasitesi değerlendirilir.",
          "Bu analizler düzenli yapıldığında şirketin finansal riskleri erkenden fark edilir. Böylece yönetim, finansman ihtiyacı, yatırım kararı, maliyet kontrolü ve fiyatlandırma gibi konularda daha güçlü bir zeminde hareket eder.",
        ],
      },
      {
        title: "Nakit Akış ve Bütçe Takibi",
        paragraphs: [
          "Nakit akış raporları, işletmenin günlük operasyonlarını güvenli şekilde sürdürebilmesi için kritik öneme sahiptir. Tahsilat ve ödeme takvimlerinin düzenli takip edilmesi, şirketin kısa ve orta vadeli finansal yükümlülüklerini daha kontrollü yönetmesini sağlar.",
          "Bütçe ve gerçekleşen karşılaştırmaları ile planlanan hedefler ve mevcut performans arasındaki farklar görünür hale gelir. Bu sayede işletme, gerekli aksiyonları zamanında alabilir ve finansal disiplini güçlendirebilir.",
        ],
      },
    ],
    benefits: [
      "Yönetim kararları için daha anlaşılır finansal veri sağlar.",
      "Nakit akış ve bütçe süreçlerini daha kontrollü hale getirir.",
      "Mali tablo performansını düzenli takip etmeyi kolaylaştırır.",
      "Finansal risklerin erken fark edilmesine destek olur.",
    ],
  },
  {
    slug: "denetim-hizmetleri",
    title: "Denetim Hizmetleri",
    description:
      "Muhasebe, finansal raporlama ve iç kontrol süreçlerinizi mevzuata ve kurumsal standartlara uygun şekilde inceliyoruz.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80",
    details: [
      "İç denetim, mali danışmanlık ve özel amaçlı raporlar",
      "KDV çözümleri, KDV iadeleri ve özel incelemeler",
      "İç kontrol sistem incelemeleri ve süreç denetimleri",
      "Muhasebe kayıtlarının VUK ve genel kabul görmüş ilkelere uyum kontrolü",
    ],
    seoTitle: "Denetim Hizmetleri | İç Denetim, KDV İadesi ve Mali Kontrol",
    seoDescription:
      "İç denetim, mali danışmanlık, KDV çözümleri, özel amaçlı raporlar, iç kontrol sistem incelemeleri ve muhasebe kayıt kontrolü hizmetleri.",
    intro:
      "Denetim hizmetleri, şirketlerin finansal kayıtlarının doğruluğunu, mevzuata uyumunu ve iç kontrol yapısının etkinliğini değerlendirmek için önemli bir güvence sağlar. Soral Danışmanlık olarak işletmelerin muhasebe ve finans süreçlerini sistemli şekilde inceliyor, riskli alanları tespit ediyor ve daha güvenli bir finansal yapı kurulmasına destek oluyoruz.",
    sections: [
      {
        title: "İç Denetim ve Mali Danışmanlık",
        paragraphs: [
          "İç denetim çalışmaları, işletme içindeki mali süreçlerin, onay mekanizmalarının, kayıt düzeninin ve raporlama sisteminin ne kadar sağlıklı çalıştığını ortaya koyar. Bu süreçte yalnızca hata aramakla kalmaz, aynı zamanda işletmenin daha verimli ve kontrollü çalışması için iyileştirme alanlarını da belirleriz.",
          "Mali danışmanlık desteği ile denetim sonuçlarını uygulanabilir aksiyonlara dönüştürüyoruz. Yönetimin ihtiyaç duyduğu özel raporlar, süreç değerlendirmeleri ve kontrol önerileriyle şirketin finansal karar alma kabiliyetini güçlendiriyoruz.",
        ],
      },
      {
        title: "KDV Çözümleri ve Özel İncelemeler",
        paragraphs: [
          "KDV iadeleri, mahsup süreçleri ve özel incelemeler, mevzuat bilgisi ve düzenli dokümantasyon gerektiren hassas alanlardır. Bu alanda işletmenin belgelerini, kayıtlarını ve beyan süreçlerini kontrol ederek olası eksiklikleri önceden tespit ediyoruz.",
          "KDV süreçlerinde doğru hazırlık yapılması, hem iade süreçlerinin daha sağlıklı ilerlemesine hem de vergi risklerinin azaltılmasına katkı sağlar. Özel amaçlı raporlar ve incelemelerle yönetimin belirli bir konu hakkında net bilgiye ulaşmasını sağlıyoruz.",
        ],
      },
      {
        title: "İç Kontrol Sistemlerinin İncelenmesi",
        paragraphs: [
          "İç kontrol sistemi, şirketin mali kayıtlarının güvenilirliği, varlıklarının korunması ve süreçlerin sürdürülebilirliği açısından temel bir yapıdır. Yetki, onay, kayıt, mutabakat ve raporlama adımlarının düzenli çalışması, işletme içinde hata ve suiistimal risklerini azaltır.",
          "İç kontrol incelemelerinde mevcut süreçleri analiz ediyor, zayıf noktaları belirliyor ve şirketin büyüklüğüne uygun uygulanabilir kontrol önerileri sunuyoruz. Bu yaklaşım, şirketlerin kurumsallaşma sürecine de doğrudan katkı sağlar.",
        ],
      },
    ],
    benefits: [
      "Muhasebe kayıtlarının mevzuata uygunluğunu güçlendirir.",
      "KDV ve özel inceleme süreçlerinde riskleri azaltır.",
      "İç kontrol yapısının daha sağlıklı kurulmasına yardımcı olur.",
      "Yönetim için güvenilir mali bilgi üretimini destekler.",
    ],
  },
  {
    slug: "muhasebe-hizmetleri",
    title: "Muhasebe Hizmetleri",
    description:
      "Şirketinizin muhasebe organizasyonunu, yasal defterlerini ve beyan süreçlerini uçtan uca yönetiyoruz.",
    image:
      "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=1800&q=80",
    details: [
      "Muhasebe ve maliyet sistemlerinin kurulması",
      "Defter tutma, resmi defter kapanışları ve kayıt kontrolü",
      "Vergi beyannamelerinin hazırlanması, kontrolü ve beyanı",
      "Şirket kuruluş, mükellefiyet, değişiklik ve tasfiye işlemleri",
    ],
    seoTitle: "Muhasebe Hizmetleri | Defter Tutma ve Vergi Beyannameleri",
    seoDescription:
      "Defter tutma, muhasebe sistemi kurulumu, vergi beyannameleri, şirket kuruluş işlemleri, mükellefiyet kaydı ve resmi defter kapanış hizmetleri.",
    intro:
      "Muhasebe hizmetleri, işletmelerin yasal yükümlülüklerini eksiksiz yerine getirmesi ve finansal kayıtlarını düzenli biçimde takip etmesi için temel bir ihtiyaçtır. Soral Danışmanlık olarak muhasebe kayıtlarınızı yalnızca beyan dönemlerinde değil, yıl boyunca düzenli ve kontrol edilebilir bir yapıda yönetiyoruz.",
    sections: [
      {
        title: "Muhasebe Sistemi ve Kayıt Düzeni",
        paragraphs: [
          "Sağlıklı bir muhasebe sistemi, şirketin gelir, gider, maliyet, tahsilat, ödeme ve stok gibi temel finansal hareketlerini doğru sınıflandırır. Bu yapı hem yasal defterlerin doğru tutulmasını hem de işletme yönetiminin güvenilir finansal bilgiye ulaşmasını sağlar.",
          "Muhasebe ve maliyet sistemlerinin kurulması aşamasında şirketin faaliyet alanı, işlem hacmi, personel yapısı ve raporlama ihtiyacı dikkate alınır. Böylece işletmeye özel, sürdürülebilir ve denetlenebilir bir kayıt düzeni oluşturulur.",
        ],
      },
      {
        title: "Vergi Beyannameleri ve Yasal Süreçler",
        paragraphs: [
          "KDV, Muhtasar, Damga Vergisi, Geçici Vergi, Gelir Vergisi ve Kurumlar Vergisi gibi beyannamelerin doğru hazırlanması ve zamanında beyan edilmesi, şirketler için kritik öneme sahiptir. Beyan süreçlerinde kayıtların doğruluğunu kontrol ediyor ve yükümlülüklerin takvimine uygun ilerlemesini sağlıyoruz.",
          "Resmi defterlerin yıl sonu kapanışları, dönem sonu işlemleri ve kayıt kontrolleri düzenli şekilde yürütüldüğünde şirketlerin mali süreçleri daha güvenli hale gelir. Bu disiplin, olası denetim ve inceleme süreçlerinde de güçlü bir hazırlık sağlar.",
        ],
      },
      {
        title: "Şirket Kuruluş ve Mükellefiyet İşlemleri",
        paragraphs: [
          "Şirket kuruluşu, mükellefiyet kaydı, adres değişikliği, faaliyet değişikliği, ortaklık yapısı değişiklikleri ve tasfiye işlemleri gibi süreçler doğru belge ve doğru zamanlama gerektirir. Bu işlemlerin eksiksiz yürütülmesi, şirketin ticari faaliyetlerine sorunsuz başlaması veya devam etmesi açısından önemlidir.",
          "Kuruluş ve değişiklik işlemlerinde ilgili kurum süreçlerini takip ediyor, gerekli evrak hazırlıklarını planlıyor ve işletmenin mevzuata uygun şekilde ilerlemesine destek oluyoruz.",
        ],
      },
    ],
    benefits: [
      "Yasal defter ve beyan süreçlerini düzenli hale getirir.",
      "Muhasebe kayıtlarının doğruluğunu ve izlenebilirliğini artırır.",
      "Şirket kuruluş ve değişiklik işlemlerinde süreci kolaylaştırır.",
      "Yönetim için güvenilir finansal kayıt altyapısı oluşturur.",
    ],
  },
  {
    slug: "bordrolama-hizmetleri",
    title: "Bordrolama Hizmetleri",
    description:
      "Personel bordro süreçlerini düzenli, izlenebilir ve mevzuata uygun şekilde hazırlıyoruz.",
    image:
      "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1800&q=80",
    details: [
      "Personel bordro hazırlama hizmetleri",
      "SGK bildirgelerinin düzenlenmesi ve beyan edilmesi",
    ],
    seoTitle: "Bordrolama Hizmetleri | Personel Bordro ve SGK Bildirgeleri",
    seoDescription:
      "Personel bordro hazırlama, SGK bildirgeleri, ücret hesaplamaları, bordro kontrolü ve mevzuata uygun personel süreçleri için bordrolama hizmetleri.",
    intro:
      "Bordrolama hizmetleri, personel ücretlerinin doğru hesaplanması, SGK bildirimlerinin düzenli yapılması ve işveren yükümlülüklerinin mevzuata uygun yönetilmesi için kritik bir süreçtir. Soral Danışmanlık olarak bordro süreçlerini düzenli, şeffaf ve takip edilebilir şekilde hazırlıyoruz.",
    sections: [
      {
        title: "Personel Bordro Hazırlama",
        paragraphs: [
          "Personel bordrolarında brüt ücret, net ücret, ek ödemeler, kesintiler, primler, fazla mesai, izin ve benzeri değişkenlerin doğru değerlendirilmesi gerekir. Hatalı bordro hesaplamaları hem çalışan memnuniyetini hem de işverenin yasal risklerini etkileyebilir.",
          "Bordro hazırlama hizmetlerimizde personel bilgilerinin güncelliği, çalışma günleri, izin kayıtları ve ödeme detayları düzenli şekilde kontrol edilir. Böylece şirketlerin ücret ödeme süreçleri daha sistemli ve güvenilir hale gelir.",
        ],
      },
      {
        title: "SGK Bildirgeleri ve Yasal Takip",
        paragraphs: [
          "SGK bildirgelerinin doğru düzenlenmesi ve zamanında beyan edilmesi, işveren yükümlülüklerinin temel parçalarından biridir. Prim gün sayıları, kazanç bildirimleri ve işe giriş-çıkış süreçleri dikkatli takip edilmelidir.",
          "Mevzuat değişiklikleri ve dönemsel yükümlülükler doğrultusunda bordro ve SGK süreçlerini kontrol ediyor, eksik veya hatalı bildirim riskini azaltmaya yönelik düzenli takip sağlıyoruz.",
        ],
      },
      {
        title: "İzlenebilir ve Düzenli Personel Süreci",
        paragraphs: [
          "Bordrolama yalnızca ücret hesaplama değildir; aynı zamanda personel maliyetlerinin yönetilmesi ve işletmenin insan kaynakları tarafındaki mali yükümlülüklerinin izlenmesi anlamına gelir. Düzenli bordro raporları, personel giderlerinin daha net analiz edilmesini sağlar.",
          "İşletmeler için bordro süreçlerinin dışarıdan profesyonel destekle yürütülmesi, hata riskini azaltır ve iç ekiplerin operasyonel yükünü hafifletir.",
        ],
      },
    ],
    benefits: [
      "Personel ücret hesaplamalarını daha düzenli hale getirir.",
      "SGK bildirge süreçlerinde hata riskini azaltır.",
      "Personel maliyetlerinin izlenmesini kolaylaştırır.",
      "Mevzuata uygun bordro yönetimini destekler.",
    ],
  },
  {
    slug: "tesvik-takip-hizmetleri",
    title: "Teşvik Takip Hizmetleri",
    description:
      "İşletmenizin yararlanabileceği maddi ve ayni teşvikleri tespit edip başvuru sürecini takip ediyoruz.",
    image:
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1800&q=80",
    details: [
      "Şirketinize uygun teşviklerin analiz edilmesi",
      "Başvuru dosyalarının hazırlanması ve müracaat sürecinin yürütülmesi",
      "Faydalanma koşullarının takip edilmesi",
    ],
    seoTitle: "Teşvik Takip Hizmetleri | Devlet Teşvikleri ve Başvuru Süreci",
    seoDescription:
      "Şirketlere uygun teşviklerin analiz edilmesi, teşvik başvuru dosyalarının hazırlanması, müracaat süreci ve faydalanma koşullarının takibi.",
    intro:
      "Teşvik takip hizmetleri, işletmelerin faaliyet alanlarına, yatırım planlarına, istihdam yapılarına ve sektörel ihtiyaçlarına uygun desteklerden yararlanabilmesi için önemlidir. Soral Danışmanlık olarak şirketinizin faydalanabileceği maddi ve ayni teşvikleri analiz ediyor, başvuru ve takip süreçlerinde destek sağlıyoruz.",
    sections: [
      {
        title: "Şirkete Uygun Teşviklerin Analizi",
        paragraphs: [
          "Her işletmenin yararlanabileceği teşvik ve destekler faaliyet alanına, bölgesine, personel yapısına, yatırım planına ve mali durumuna göre değişebilir. Bu nedenle teşvik sürecinin ilk adımı, şirketin mevcut yapısının doğru analiz edilmesidir.",
          "Uygun teşviklerin belirlenmesi sayesinde işletmeler maliyet avantajı elde edebilir, yatırım kararlarını daha verimli planlayabilir ve kamu desteklerinden daha bilinçli şekilde yararlanabilir.",
        ],
      },
      {
        title: "Başvuru Dosyası ve Müracaat Süreci",
        paragraphs: [
          "Teşvik başvuruları çoğu zaman belge hazırlığı, finansal veri sunumu, faaliyet açıklaması ve resmi kurum süreçlerinin takibini gerektirir. Eksik veya hatalı hazırlanan dosyalar başvurunun uzamasına ya da olumsuz sonuçlanmasına neden olabilir.",
          "Başvuru dosyalarının hazırlanması, gerekli belgelerin kontrol edilmesi ve müracaat sürecinin düzenli takip edilmesiyle işletmelerin teşviklerden daha sağlıklı şekilde faydalanmasına yardımcı oluyoruz.",
        ],
      },
      {
        title: "Faydalanma Koşullarının Takibi",
        paragraphs: [
          "Teşvikten yararlanmak kadar, teşvik koşullarının sürdürülebilir şekilde takip edilmesi de önemlidir. Bazı desteklerde belirli dönemlerde raporlama, belge sunumu veya şartların korunması gerekebilir.",
          "Bu süreçte işletmenin yükümlülüklerini düzenli takip ediyor, teşvikten faydalanma hakkının korunması için gerekli kontrolleri sağlıyoruz.",
        ],
      },
    ],
    benefits: [
      "Şirketinize uygun destekleri daha görünür hale getirir.",
      "Başvuru sürecinde belge ve takip yükünü azaltır.",
      "Teşviklerden faydalanma koşullarının korunmasına destek olur.",
      "Yatırım ve büyüme planlarında maliyet avantajı sağlar.",
    ],
  },
  {
    slug: "vergi-danismanligi",
    title: "Vergi Danışmanlığı",
    description:
      "Vergi mevzuatındaki değişiklikleri takip ederek yükümlülüklerinizi verimli ve riskleri azaltan bir yapıda yönetiyoruz.",
    image:
      "https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?auto=format&fit=crop&w=1800&q=80",
    details: [
      "Vergi planlaması ve mevzuat değişikliklerinin takibi",
      "Beyan süreçlerinde risk analizi ve kontrol",
      "İşletmeye özel vergi danışmanlığı",
    ],
    seoTitle: "Vergi Danışmanlığı | Vergi Planlaması ve Mevzuat Takibi",
    seoDescription:
      "Vergi danışmanlığı, vergi planlaması, mevzuat değişikliklerinin takibi, beyan kontrolü ve işletmeye özel vergi risk analizi hizmetleri.",
    intro:
      "Vergi danışmanlığı, işletmelerin vergi yükümlülüklerini doğru, zamanında ve sürdürülebilir şekilde yönetmesi için stratejik bir hizmettir. Soral Danışmanlık olarak vergi mevzuatındaki değişiklikleri takip ediyor, işletmenizin faaliyet yapısına uygun vergi süreçleri oluşturuyoruz.",
    sections: [
      {
        title: "Vergi Planlaması ve Mevzuat Takibi",
        paragraphs: [
          "Vergi mevzuatı sürekli değişen ve dikkatli takip edilmesi gereken bir alandır. İşletmelerin yalnızca mevcut yükümlülüklerini yerine getirmesi değil, aynı zamanda gelecekte doğabilecek vergi etkilerini de öngörmesi gerekir.",
          "Vergi planlaması kapsamında şirketin gelir yapısı, gider kalemleri, yatırım kararları, finansman modeli ve faaliyet alanı birlikte değerlendirilir. Böylece mevzuata uygun, riskleri azaltan ve işletmenin mali yapısını destekleyen bir yaklaşım geliştirilir.",
        ],
      },
      {
        title: "Beyan Süreçlerinde Risk Analizi",
        paragraphs: [
          "Vergi beyannamelerinin hazırlanması sırasında kayıtların doğruluğu, belge düzeni, matrah hesaplamaları ve indirim-istisna uygulamaları dikkatli kontrol edilmelidir. Hatalı veya eksik beyanlar işletmeler için ileride mali risk oluşturabilir.",
          "Beyan süreçlerinde risk analizi yaparak olası hataları önceden tespit ediyor, şirketin yasal yükümlülüklerini daha güvenli şekilde yerine getirmesine destek oluyoruz.",
        ],
      },
      {
        title: "İşletmeye Özel Vergi Danışmanlığı",
        paragraphs: [
          "Her şirketin faaliyet alanı, gelir modeli, gider yapısı ve büyüme hedefi farklıdır. Bu nedenle vergi danışmanlığında tek tip çözümler yerine işletmeye özel değerlendirme yapılması gerekir.",
          "Şirketinizin ihtiyaçlarına göre dönemsel danışmanlık, işlem bazlı değerlendirme, vergi etkisi analizi ve mevzuat yorumlama desteği sunuyoruz. Bu yaklaşım, yönetimin daha bilinçli ve güvenli karar almasını sağlar.",
        ],
      },
    ],
    benefits: [
      "Vergi yükümlülüklerinin düzenli takip edilmesini sağlar.",
      "Beyan süreçlerindeki hata ve riskleri azaltır.",
      "Mevzuat değişikliklerine daha hızlı uyum sağlar.",
      "Şirkete özel vergi planlaması ile finansal öngörü kazandırır.",
    ],
  },
  {
    slug: "finansal-danismanlik",
    title: "Finansal Danışmanlık",
    description:
      "Finansal tablolarınızı, nakit akışınızı ve büyüme kararlarınızı veriye dayalı şekilde değerlendiriyoruz.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=80",
    details: [
      "Finansal durum analizi ve stratejik karar desteği",
      "Bütçe, nakit akış ve karlılık değerlendirmeleri",
      "Şirket büyüme ve sürdürülebilirlik danışmanlığı",
    ],
    seoTitle: "Finansal Danışmanlık | Nakit Akış, Bütçe ve Karlılık Analizi",
    seoDescription:
      "Finansal danışmanlık, nakit akış yönetimi, bütçe planlama, karlılık analizi, finansal durum değerlendirmesi ve stratejik karar desteği.",
    intro:
      "Finansal danışmanlık, işletmelerin mevcut finansal durumunu anlamasına, büyüme kararlarını daha sağlam temellere oturtmasına ve kaynaklarını daha verimli kullanmasına yardımcı olur. Soral Danışmanlık olarak finansal verilerinizi analiz ediyor, şirketinizin hedeflerine uygun stratejik öneriler geliştiriyoruz.",
    sections: [
      {
        title: "Finansal Durum Analizi",
        paragraphs: [
          "Şirketin finansal sağlığını anlamak için gelir tablosu, bilanço, nakit akış yapısı, borçluluk seviyesi, tahsilat performansı ve maliyet kalemleri birlikte değerlendirilmelidir. Finansal durum analizi, işletmenin güçlü ve zayıf yönlerini ortaya koyar.",
          "Bu analiz sayesinde yönetim, hangi alanlarda iyileştirme yapılması gerektiğini, hangi yatırımların daha dikkatli planlanması gerektiğini ve hangi finansal risklerin takip edilmesi gerektiğini daha net görebilir.",
        ],
      },
      {
        title: "Bütçe, Nakit Akış ve Karlılık",
        paragraphs: [
          "Bütçe planlaması, şirketin kaynaklarını daha verimli kullanmasını ve hedeflerini ölçülebilir hale getirmesini sağlar. Nakit akış takibi ise günlük operasyonların sürdürülebilirliği açısından kritik bir göstergedir.",
          "Karlılık değerlendirmeleri ile ürün, hizmet, müşteri veya proje bazında finansal performans analiz edilebilir. Bu sayede işletme daha karlı alanlara odaklanabilir ve maliyetlerini daha bilinçli yönetebilir.",
        ],
      },
      {
        title: "Büyüme ve Sürdürülebilirlik Danışmanlığı",
        paragraphs: [
          "Büyüme kararları yalnızca satış artışıyla değil, finansal kapasite, nakit döngüsü, insan kaynağı, operasyonel yapı ve risk yönetimiyle birlikte değerlendirilmelidir. Plansız büyüme, şirketlerde finansal baskı yaratabilir.",
          "Finansal danışmanlık sürecinde büyüme hedeflerinizi mevcut finansal yapınızla birlikte değerlendiriyor, sürdürülebilir ve kontrollü ilerlemenize destek olacak finansal yol haritaları hazırlıyoruz.",
        ],
      },
    ],
    benefits: [
      "Finansal kararların veriye dayalı alınmasına destek olur.",
      "Nakit akış ve bütçe yönetimini güçlendirir.",
      "Karlılık ve maliyet yapısının daha net görülmesini sağlar.",
      "Büyüme kararlarında sürdürülebilirlik perspektifi kazandırır.",
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
