/* Ngũ Âm content: every instrument in the prototype, in English and Vietnamese.
   Kept in a .js file because pages opened from file:// cannot fetch() JSON.
   Each fact comes from the source named in `source`.

   recognisable: the Identify model knows this instrument (model v1 classes).
   page:         it has its own Instrument page (instrument.html?id=...).
   playable:     it can be played on screen in this prototype. */
window.NGUAM_DATA = {
  families: [
    { id: "strings", en: "Strings", vi: "Dây" },
    { id: "winds", en: "Winds", vi: "Hơi" },
    { id: "percussion", en: "Percussion", vi: "Gõ" }
  ],

  regions: [
    { id: "nationwide", en: "Nationwide", vi: "Cả nước" },
    { id: "north", en: "The North", vi: "Miền Bắc" },
    { id: "hue", en: "Huế and the Centre", vi: "Huế và miền Trung" },
    { id: "highlands", en: "Central Highlands", vi: "Tây Nguyên" }
  ],

  // Rows shown in the compare view, in this order.
  compareRows: [
    { id: "body", en: "Body", vi: "Thân đàn" },
    { id: "sound", en: "Strings or sound", vi: "Dây hoặc cách tạo tiếng" },
    { id: "play", en: "How it is played", vi: "Cách chơi" },
    { id: "heard", en: "Where you hear it", vi: "Nghe ở đâu" }
  ],

  instruments: [
    {
      id: "dan-bau",
      vi: "đàn bầu",
      seal: ["Đàn", "bầu"],
      en: "monochord",
      say: "dahn bow",
      aliases: ["độc huyền cầm", "monochord", "one string zither"],
      family: "strings",
      region: "nationwide",
      people: { en: "Kinh (Việt)", vi: "Kinh (Việt)" },
      recognisable: true, page: true, playable: true,
      image: { file: "assets/img/dan-bau-800.jpg", webp: "assets/img/dan-bau-800.webp", w: 800, h: 431, credit: "Daderot, Wikimedia Commons, CC0",
        alt: { en: "A đàn bầu on display: a long wooden box with one string and a thin rod at one end.", vi: "Một cây đàn bầu trưng bày: hộp gỗ dài, một dây đàn và cần đàn mảnh ở một đầu." } },
      summary: {
        en: "One string and a flexible rod. The player touches the string lightly at harmonic points and bends the rod, so a single string can glide and sing like a voice.",
        vi: "Một dây đàn và một chiếc cần mềm. Người chơi chạm nhẹ vào dây ở các điểm bồi âm và uốn cần đàn, nên chỉ một dây mà có thể luyến láy như giọng người."
      },
      facts: [
        { en: "The earliest written record dates it to 1770, but scholars think it may be up to a thousand years older.", vi: "Ghi chép sớm nhất về đàn bầu là năm 1770, nhưng các nhà nghiên cứu cho rằng đàn có thể đã có từ trước đó cả nghìn năm." },
        { en: "It was first a bamboo tube, a wooden rod, half a coconut shell and a silk string. Today the body is a wooden box and the string is often a guitar string.", vi: "Thuở đầu đàn chỉ gồm một ống tre, một cần gỗ, nửa gáo dừa và một sợi dây tơ. Ngày nay thân đàn là hộp gỗ, dây thường là dây đàn guitar." },
        { en: "It has long been played by blind musicians, solo in folk music and to accompany poetry.", vi: "Từ lâu đàn bầu gắn với những người nghệ sĩ khiếm thị, chơi độc tấu dân ca và đệm cho ngâm thơ." }
      ],
      compare: {
        body: { en: "A long wooden box, with a flexible rod rising at one end", vi: "Hộp gỗ dài, một đầu có cần đàn mềm dựng lên" },
        sound: { en: "One string; the notes are harmonics", vi: "Một dây; các nốt là âm bồi" },
        play: { en: "Plucked with a long plectrum while the hand touches harmonic points; the rod bends the pitch", vi: "Gảy bằng que dài trong khi cạnh bàn tay chạm điểm bồi âm; cần đàn uốn cao độ" },
        heard: { en: "Folk music, poetry recitation, modern pop", vi: "Dân ca, ngâm thơ, nhạc pop hiện đại" }
      },
      telling: { en: "One string, and a thin rod rising from the box.", vi: "Một dây, và một cần đàn mảnh dựng lên từ hộp đàn." },
      source: { label: "Wikipedia, “Đàn bầu”", url: "https://en.wikipedia.org/wiki/%C4%90%C3%A0n_b%E1%BA%A7u" }
    },
    {
      id: "dan-tranh",
      vi: "đàn tranh",
      seal: ["Đàn", "tranh"],
      en: "zither",
      say: "dahn chang",
      aliases: ["đàn thập lục", "zither", "16 strings"],
      family: "strings",
      region: "nationwide",
      people: { en: "Kinh (Việt)", vi: "Kinh (Việt)" },
      recognisable: true, page: true, playable: true,
      summary: {
        en: "A long zither with steel strings over movable bridges, tuned to the five-tone scale. The right hand plucks, the left hand presses the strings to bend the notes.",
        vi: "Đàn dài, dây thép căng trên những con nhạn di động, lên dây theo thang năm âm. Tay phải gảy, tay trái nhấn dây để luyến nốt."
      },
      facts: [
        { en: "It is also called đàn thập lục, “sixteen strings”: the 16-string version was the standard from the 19th century until the 1980s.", vi: "Đàn còn gọi là đàn thập lục, tức “mười sáu dây”: loại 16 dây là chuẩn từ thế kỷ 19 tới những năm 1980." },
        { en: "Since the late 1980s the 17-string version has become the standard across Vietnam.", vi: "Từ cuối những năm 1980, loại 17 dây trở thành chuẩn trên cả nước." },
        { en: "It comes from the Chinese zheng, the same ancestor as the Japanese koto and the Korean gayageum.", vi: "Đàn có gốc từ đàn tranh (zheng) của Trung Quốc, cùng tổ tiên với đàn koto của Nhật và gayageum của Hàn Quốc." }
      ],
      compare: {
        body: { en: "A long, curved soundbox, about 104 to 120 cm", vi: "Hộp đàn dài, mặt cong, khoảng 104 đến 120 cm" },
        sound: { en: "16 or 17 steel strings over movable bridges", vi: "16 hoặc 17 dây thép trên con nhạn di động" },
        play: { en: "Plucked with picks on the right hand; the left hand presses to bend", vi: "Gảy bằng móng đeo tay phải; tay trái nhấn để luyến" },
        heard: { en: "Solo, in ensembles and accompanying singing", vi: "Độc tấu, hòa tấu và đệm hát" }
      },
      telling: { en: "A long, flat box with many strings over small bridges.", vi: "Hộp đàn dài, nhiều dây căng trên những con nhạn nhỏ." },
      source: { label: "Wikipedia, “Đàn tranh”", url: "https://en.wikipedia.org/wiki/%C4%90%C3%A0n_tranh" }
    },
    {
      id: "dan-nguyet",
      vi: "đàn nguyệt",
      seal: ["Đàn", "nguyệt"],
      en: "moon lute",
      say: "dahn nwee-et",
      aliases: ["nguyệt cầm", "đàn kìm", "moon lute"],
      family: "strings",
      region: "nationwide",
      people: { en: "Kinh (Việt)", vi: "Kinh (Việt)" },
      recognisable: true, page: true, playable: false,
      summary: {
        en: "A two-stringed lute named after the moon. Its raised frets let the player press a string towards the neck and bend the note, which Vietnamese music needs.",
        vi: "Đàn hai dây mang tên mặt trăng. Phím đàn cao cho người chơi nhấn dây xuống cần để luyến nốt, điều mà nhạc Việt rất cần."
      },
      facts: [
        { en: "Its name means “moon string instrument”; it is also called nguyệt cầm or đàn kìm.", vi: "Tên đàn nghĩa là “đàn mặt trăng”; đàn còn gọi là nguyệt cầm hay đàn kìm." },
        { en: "The strings, once twisted silk, are now usually nylon, kept at a low tension.", vi: "Dây đàn xưa làm bằng tơ se, nay thường là dây nylon, căng ở độ chùng thấp." },
        { en: "It is played in both folk and classical music across Vietnam.", vi: "Đàn được dùng trong cả nhạc dân gian lẫn nhạc cổ truyền trên khắp Việt Nam." }
      ],
      compare: {
        body: { en: "A round, moon-shaped body", vi: "Thân tròn như mặt trăng" },
        sound: { en: "2 strings, high raised frets", vi: "2 dây, phím đàn cao" },
        play: { en: "Plucked with a small plectrum; bends by pressing the string towards the neck", vi: "Gảy bằng miếng gảy nhỏ; luyến bằng cách nhấn dây xuống cần" },
        heard: { en: "Folk and classical music across Vietnam", vi: "Nhạc dân gian và cổ truyền khắp Việt Nam" }
      },
      telling: { en: "Round body and two strings.", vi: "Thân tròn, hai dây." },
      source: { label: "Wikipedia, “Đàn nguyệt”", url: "https://en.wikipedia.org/wiki/%C4%90%C3%A0n_nguy%E1%BB%87t" }
    },
    {
      id: "dan-ty-ba",
      vi: "đàn tỳ bà",
      seal: ["Tỳ", "bà"],
      en: "pear-shaped lute",
      say: "dahn tee bah",
      aliases: ["đàn tì bà", "pipa", "pear lute"],
      family: "strings",
      region: "hue",
      people: { en: "Kinh (Việt)", vi: "Kinh (Việt)" },
      recognisable: true, page: true, playable: false,
      summary: {
        en: "A pear-shaped lute with four strings, held almost upright. It belonged to the royal court and is still played at the Imperial Palace in Huế.",
        vi: "Đàn hình quả lê, bốn dây, khi chơi dựng gần như thẳng đứng. Đàn gắn với cung đình và nay vẫn được chơi tại Đại Nội Huế."
      },
      facts: [
        { en: "It comes from the Chinese pipa and reached Vietnam around the Trần dynasty.", vi: "Đàn có gốc từ đàn pipa của Trung Quốc, vào Việt Nam khoảng thời nhà Trần." },
        { en: "Players bend the notes often with the fingers of the left hand.", vi: "Người chơi thường xuyên nhấn luyến bằng các ngón tay trái." }
      ],
      compare: {
        body: { en: "A pear-shaped wooden body", vi: "Thân gỗ hình quả lê" },
        sound: { en: "4 strings, once silk, now nylon", vi: "4 dây, xưa bằng tơ, nay bằng nylon" },
        play: { en: "Held almost upright and plucked with a plectrum; the left hand bends the notes", vi: "Dựng gần thẳng đứng, gảy bằng miếng gảy; tay trái nhấn luyến" },
        heard: { en: "Court music and the ensemble of the Imperial Palace in Huế", vi: "Nhạc cung đình, dàn nhạc tại Đại Nội Huế" }
      },
      telling: { en: "Pear-shaped body and four strings.", vi: "Thân hình quả lê, bốn dây." },
      source: { label: "Wikipedia, “Đàn tỳ bà”", url: "https://en.wikipedia.org/wiki/%C4%90%C3%A0n_t%E1%BB%B3_b%C3%A0" }
    },
    {
      id: "sao-truc",
      vi: "sáo trúc",
      seal: ["Sáo", "trúc"],
      en: "bamboo flute",
      say: "sow chook",
      aliases: ["sáo", "sao", "flute", "bamboo flute"],
      family: "winds",
      region: "nationwide",
      people: { en: "Kinh (Việt)", vi: "Kinh (Việt)" },
      recognisable: true, page: true, playable: true,
      summary: {
        en: "A bamboo flute held sideways, to the player's right. It is often seen as a symbol of the Vietnamese countryside.",
        vi: "Sáo làm bằng tre trúc, thổi ngang, cầm về phía bên phải. Tiếng sáo thường được xem là biểu tượng của làng quê Việt Nam."
      },
      facts: [
        { en: "Sáo simply means “flute”; other kinds include the sáo dọc, played end-on like a recorder.", vi: "Sáo nghĩa đơn giản là “ống sáo”; ngoài sáo ngang còn có sáo dọc, thổi đầu ống như sáo recorder." },
        { en: "It is played solo or in the ensembles of chèo, chầu văn and nhã nhạc.", vi: "Sáo được thổi độc tấu hoặc trong dàn nhạc chèo, chầu văn và nhã nhạc." }
      ],
      compare: {
        body: { en: "A bamboo tube with finger holes", vi: "Ống tre có lỗ bấm" },
        sound: { en: "Air blown across the mouth hole", vi: "Thổi hơi qua lỗ thổi" },
        play: { en: "Held sideways to the right; fingers cover the holes", vi: "Cầm ngang về bên phải; ngón tay bịt các lỗ" },
        heard: { en: "Solo, chèo, chầu văn and nhã nhạc", vi: "Độc tấu, chèo, chầu văn, nhã nhạc" }
      },
      telling: { en: "A bamboo tube you blow across, held sideways.", vi: "Ống tre thổi ngang." },
      source: { label: "Wikipedia, “Sáo”", url: "https://en.wikipedia.org/wiki/S%C3%A1o" }
    },
    {
      id: "dan-nhi",
      vi: "đàn nhị",
      seal: ["Đàn", "nhị"],
      en: "two-string fiddle",
      say: "dahn nyee",
      aliases: ["đàn cò", "fiddle", "erhu"],
      family: "strings",
      region: "nationwide",
      people: { en: "Kinh (Việt); related fiddles among the Mường, Chứt and Khmer", vi: "Kinh (Việt); người Mường, Chứt, Khmer có những loại đàn kéo gần giống" },
      recognisable: false, page: false, playable: false,
      summary: {
        en: "A fiddle with two strings, played with a bow. Nhị means “two”.",
        vi: "Đàn hai dây, chơi bằng cây vĩ kéo. “Nhị” nghĩa là hai."
      },
      facts: [
        { en: "One end of the sound box is usually covered with snakeskin.", vi: "Một đầu bầu đàn thường được bịt bằng da rắn." },
        { en: "It is also called đàn cò, and belongs to the same family as the Chinese huqin fiddles.", vi: "Đàn còn gọi là đàn cò, cùng họ với các loại đàn kéo hồ cầm của Trung Quốc." }
      ],
      compare: {
        body: { en: "A small sound box on a long thin neck", vi: "Bầu đàn nhỏ trên cần dài, mảnh" },
        sound: { en: "2 strings", vi: "2 dây" },
        play: { en: "Bowed", vi: "Kéo bằng vĩ" },
        heard: { en: "Traditional ensembles across Vietnam", vi: "Các dàn nhạc dân tộc khắp Việt Nam" }
      },
      telling: { en: "Two strings, played with a bow.", vi: "Hai dây, chơi bằng vĩ kéo." },
      source: { label: "Wikipedia, “Đàn nhị”", url: "https://en.wikipedia.org/wiki/%C4%90%C3%A0n_nh%E1%BB%8B" }
    },
    {
      id: "dan-day",
      vi: "đàn đáy",
      seal: ["Đàn", "đáy"],
      en: "long-necked lute",
      say: "dahn dye",
      aliases: ["vô để cầm", "ca tru lute"],
      family: "strings",
      region: "north",
      people: { en: "Kinh (Việt)", vi: "Kinh (Việt)" },
      recognisable: false, page: false, playable: false,
      summary: {
        en: "A three-stringed lute with a trapezoid body and a very long neck. It is one of the instruments that accompany ca trù singing in the North.",
        vi: "Đàn ba dây, thân hình thang, cần rất dài. Đây là một trong những nhạc cụ đệm cho hát ca trù ở miền Bắc."
      },
      facts: [
        { en: "Đáy means “bottom”, yet the body has no back; one source says it was once called vô để cầm, the “bottomless instrument”.", vi: "“Đáy” nghĩa là đáy, vậy mà thân đàn lại không có mặt sau; có nguồn nói đàn từng được gọi là vô để cầm, “đàn không đáy”." },
        { en: "The neck carries ten raised frets.", vi: "Cần đàn có mười phím cao." }
      ],
      compare: {
        body: { en: "A trapezoid body with no back", vi: "Thân hình thang, không có mặt sau" },
        sound: { en: "3 strings, 10 raised frets on a very long neck", vi: "3 dây, 10 phím cao trên cần rất dài" },
        play: { en: "Plucked", vi: "Gảy" },
        heard: { en: "Ca trù singing in the North", vi: "Hát ca trù ở miền Bắc" }
      },
      telling: { en: "A trapezoid body, three strings and a very long neck.", vi: "Thân hình thang, ba dây, cần rất dài." },
      source: { label: "Wikipedia, “Đàn đáy”", url: "https://en.wikipedia.org/wiki/%C4%90%C3%A0n_%C4%91%C3%A1y" }
    },
    {
      id: "trong-com",
      vi: "trống cơm",
      seal: ["Trống", "cơm"],
      en: "rice drum",
      say: "trohng kum",
      aliases: ["rice drum", "drum"],
      family: "percussion",
      region: "north",
      people: { en: "Kinh (Việt)", vi: "Kinh (Việt)" },
      recognisable: false, page: false, playable: false,
      summary: {
        en: "A long barrel drum with a head at each end. It is called the “rice drum” because players smear cooked rice on the heads to tune them.",
        vi: "Trống dài hình thùng, hai đầu đều có mặt trống. Gọi là trống cơm vì người chơi miết cơm chín lên mặt trống để chỉnh tiếng."
      },
      facts: [
        { en: "The two heads are traditionally tuned five notes apart.", vi: "Hai mặt trống theo lệ được chỉnh cách nhau năm nốt." },
        { en: "It is a key instrument of hát bội and chèo, and gives its name to a well-known northern folk song.", vi: "Đây là nhạc cụ quan trọng của hát bội và chèo, và là tên một bài dân ca Bắc Bộ quen thuộc." }
      ],
      compare: {
        body: { en: "A long barrel with two drumheads", vi: "Thân dài hình thùng, hai mặt trống" },
        sound: { en: "Two heads tuned with cooked rice", vi: "Hai mặt trống chỉnh tiếng bằng cơm" },
        play: { en: "Struck with the hands, sometimes with sticks; can be slung from the shoulder", vi: "Vỗ bằng tay, đôi khi dùng dùi; có thể đeo qua vai" },
        heard: { en: "Hát bội and chèo", vi: "Hát bội và chèo" }
      },
      telling: { en: "A barrel drum with a head at each end.", vi: "Trống hình thùng, hai đầu có mặt trống." },
      source: { label: "Wikipedia, “Trống cơm”", url: "https://en.wikipedia.org/wiki/Tr%E1%BB%91ng_c%C6%A1m" }
    },
    {
      id: "dan-trung",
      vi: "đàn t'rưng",
      seal: ["T'rưng"],
      en: "bamboo xylophone",
      say: "dahn t'rung",
      aliases: ["t'rung", "trung", "xylophone", "bamboo xylophone"],
      family: "percussion",
      region: "highlands",
      people: { en: "Jarai and Bahnar", vi: "Gia Rai và Ba Na" },
      recognisable: false, page: false, playable: false,
      summary: {
        en: "A xylophone of bamboo tubes from the Central Highlands, played by the Jarai and Bahnar peoples.",
        vi: "Đàn gồm những ống tre của Tây Nguyên, của người Gia Rai và Ba Na."
      },
      facts: [
        { en: "Larger versions developed from it are now played in Vietnamese traditional ensembles to represent the music of the Highlands.", vi: "Những cây đàn lớn hơn phát triển từ nó nay được dùng trong các dàn nhạc dân tộc, đại diện cho âm nhạc Tây Nguyên." }
      ],
      compare: {
        body: { en: "A row of bamboo tubes", vi: "Một dãy ống tre" },
        sound: { en: "Each tube gives one note", vi: "Mỗi ống cho một nốt" },
        play: { en: "Struck", vi: "Gõ" },
        heard: { en: "The Central Highlands and traditional ensembles", vi: "Tây Nguyên và các dàn nhạc dân tộc" }
      },
      telling: { en: "A row of bamboo tubes that are struck.", vi: "Một dãy ống tre, chơi bằng cách gõ." },
      source: { label: "Wikipedia, “T'rưng”", url: "https://en.wikipedia.org/wiki/T%27r%C6%B0ng" }
    },
    {
      id: "klong-put",
      vi: "k'lông pút",
      seal: ["K'lông", "pút"],
      en: "clapped bamboo tubes",
      say: "k'lohng poot",
      aliases: ["klong put", "clap", "bamboo tubes"],
      family: "percussion",
      region: "highlands",
      people: { en: "Bahnar", vi: "Ba Na" },
      recognisable: false, page: false, playable: false,
      summary: {
        en: "Bamboo tubes of the Bahnar people that are not struck: the player claps near the open ends and the air inside the tubes sounds.",
        vi: "Những ống tre của người Ba Na mà không cần gõ: người chơi vỗ tay ở đầu ống, luồng hơi làm cột khí trong ống ngân lên."
      },
      facts: [
        { en: "It looks like a xylophone, but the sound comes from resonance in the tubes, not from hitting them.", vi: "Nhìn giống đàn gõ, nhưng tiếng đàn đến từ sự cộng hưởng trong ống chứ không phải từ việc gõ vào ống." }
      ],
      compare: {
        body: { en: "Bamboo tubes of different lengths", vi: "Các ống tre dài ngắn khác nhau" },
        sound: { en: "The air inside each tube resonates", vi: "Cột khí trong ống cộng hưởng" },
        play: { en: "Clapping the hands at the ends of the tubes", vi: "Vỗ hai bàn tay ở đầu ống" },
        heard: { en: "The Central Highlands", vi: "Tây Nguyên" }
      },
      telling: { en: "Bamboo tubes sounded by clapping, not striking.", vi: "Ống tre kêu nhờ vỗ tay, không gõ vào ống." },
      source: { label: "Wikipedia, “K'lông pút”", url: "https://en.wikipedia.org/wiki/K%27l%C3%B4ng_p%C3%BAt" }
    }
  ]
};
