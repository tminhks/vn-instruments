/* Ngũ Âm lessons: short, three to five steps each, in English and Vietnamese.
   Only what the prototype can really do is taught here: the five tones (hò, xự, xang, xê, cống)
   on the đàn tranh, and bending a note with the rod of the đàn bầu.
   The Western note names are the pitches the on-screen instruments actually play. */
window.NGUAM_LESSONS = [
  {
    id: "dan-tranh",
    minutes: 3,
    title: { en: "First notes: hò, xự, xang", vi: "Những nốt đầu: hò, xự, xang" },
    blurb: { en: "Hear the five tones, then play the first three on the strings.", vi: "Nghe năm âm, rồi gảy ba âm đầu trên dây đàn." },
    learned: [
      { en: "The five tones of Vietnamese music are hò, xự, xang, xê and cống.", vi: "Năm âm của nhạc Việt là hò, xự, xang, xê và cống." },
      { en: "On the đàn tranh each tone has its own string.", vi: "Trên đàn tranh, mỗi âm có một dây riêng." },
      { en: "You played hò, xự and xang, and a short phrase from them.", vi: "Bạn đã gảy hò, xự, xang và một câu ngắn từ ba âm đó." }
    ],
    steps: [
      { type: "listen", title: { en: "Hear the five tones", vi: "Nghe năm âm" },
        text: { en: "Press Listen. The five strings sound one after another: hò, xự, xang, xê, cống.", vi: "Bấm Nghe. Năm dây vang lần lượt: hò, xự, xang, xê, cống." } },
      { type: "play", targets: [0], title: { en: "Play hò", vi: "Gảy âm hò" },
        text: { en: "Hò is the first tone. Play the string marked for you.", vi: "Hò là âm đầu tiên. Hãy gảy dây được đánh dấu." } },
      { type: "play", targets: [1, 2], title: { en: "Play xự, then xang", vi: "Gảy xự, rồi xang" },
        text: { en: "Xự comes next, then xang. Play them in that order.", vi: "Tiếp theo là xự, rồi xang. Hãy gảy theo thứ tự đó." } },
      { type: "play", targets: [0, 1, 2, 1, 0], title: { en: "A little phrase", vi: "Một câu ngắn" },
        text: { en: "Put them together: hò, xự, xang, xự, hò. The next string is marked each time.", vi: "Ghép lại: hò, xự, xang, xự, hò. Mỗi lần dây tiếp theo sẽ được đánh dấu." } }
    ]
  },
  {
    id: "dan-bau",
    minutes: 3,
    title: { en: "Bend a note like a voice", vi: "Uốn một nốt như giọng người" },
    blurb: { en: "One string, one rod: pluck, then bend the note up while it rings.", vi: "Một dây, một cần đàn: gảy, rồi uốn nốt lên khi tiếng còn ngân." },
    learned: [
      { en: "The đàn bầu has one string and a flexible rod.", vi: "Đàn bầu chỉ có một dây và một cần đàn mềm." },
      { en: "Moving the rod bends the pitch, so one string can glide like a voice.", vi: "Đưa cần đàn làm cao độ đổi theo, nên một dây có thể lướt như giọng người." },
      { en: "You bent a note while it was still ringing.", vi: "Bạn đã uốn một nốt khi tiếng đàn còn ngân." }
    ],
    steps: [
      { type: "listen-bau", title: { en: "Listen for the glide", vi: "Nghe nốt lướt" },
        text: { en: "Press Listen and follow the pitch: it slides up and down, as if someone were singing.", vi: "Bấm Nghe và theo dõi cao độ: nốt trượt lên xuống như có người đang hát." } },
      { type: "pluck", title: { en: "Pluck the string", vi: "Gảy dây đàn" },
        text: { en: "Press Pluck (or the space bar) and listen to the note ring.", vi: "Bấm Gảy (hoặc phím cách) và nghe tiếng ngân." } },
      { type: "bend", title: { en: "Bend it up", vi: "Uốn nốt lên" },
        text: { en: "Pluck, then move the rod up while the note is still ringing. Raise it by at least one step.", vi: "Gảy, rồi đưa cần đàn lên trong lúc tiếng còn ngân. Hãy nâng ít nhất một nấc." } }
    ]
  }
];
