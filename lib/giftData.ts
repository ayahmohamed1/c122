export interface GiftData {
  senderName: string;
  receiverName: string;
  envelopeImage: string;
  cardMessage: string;
  birthdayImage: string;
  birthdayTitle: string;
  birthdayText: string;
  balloonImage: string;
  birthdayWishesTitle: string;
  birthdayWishesMessage: string;
  thingsWeWannaDo: string[];
  loveLetterTitle?: string;
  loveLetterSubtitle?: string;
  loveLetterParagraphs?: string[];
  musicCoverImage: string;
  musicUrl: string;
  songTitle: string;
  anniversaryTitle?: string;
  anniversaryImage?: string;
  anniversaryTargetDate?: string;
  anniversaryLetterTitle?: string;
  anniversaryLetterMessage?: string;
  ourBestMemories?: string[];
  importantDates?: string[];
  videoUrl?: string;
}

const defaultThings: string[] = [
  "Ntgwz w b3d el farah nruh nakul mn McDonalds",
  "Nlf el aalam w ngrb kul el akalat mn kul heta",
  "Ngeb awl khlftna walad w ykon esmo yazan anas karim basiouny",
  "Ngeb bet ykon feh roof aashan n3od blel feh neshar w ehna bnakul haga hlwa ana ele 3mlaha",
  "Mnkhsrsh hubna l ba3d b3d el gawaz zy ma byhsl ma ben ay etnen mtgwzen",
];

export const defaultOurBestMemories: string[] = [
  "lma zwaght mn awl hesa lya aashan no3od swa",
  "youm 3ed melady w youm 3ed meladk",
  "awl nzola nzelnaha swa b3d 1/4",
  "youm 2/7 b kul haga kanet feh w nzolet el rehab kulha",
  "awl tamrena hdrnaha swa",
  "youm ma nzlna swa ikea nakhud afkar l sh2tna",
  "youm btoltak w ana bsharkk awl maksb lek",
  "youm ma nzlna picnic swa",
  "kul nzolatna bela estsna2",
];

export const defaultImportantDates: string[] = [
  "21/9/2025",
  "15/11/2025",
  "5/2/2026",
  "1/4/2026",
  "2/5/2026",
  "2/7/2026",
];

export const defaultAnniversaryMessage =
  "bos ana abl kul haga habet a2oulk en bgd shokran aala kul haga f el sana de haslt shokran 3la kul el mshenah swa mn hlw w wehsh w ad eh ehna bgd hasal bs f sana wahda bena hagat mkansh hd fena y2dr ysthmlha bs dosna aala nfsna aashan b3dena w aadena f hbet a2oulk en bgd shokran enk kunt mwgod diman w m3aya enta mkuntsh mograd hbeb kunt saheb aruh ahkelo w ana mot2kda ene a2dr a2oulo 3la ay haga w kunt akh agrelo w atsnd aaleh kunt el ab ele hneto kanet diman btamny w 3wadtne 3n hagat kter ana m3shthash f hyate mn nhyet ab aw akh walad enta get hsestne beha w kunt diman m3aya w mhtwene w ghyrtene mn hd kan wehsh awy w b3ed 3n rbna w hyataha w nfsytha mdmaren l hd ahsan f kul haga fana lw h2oul haga f enta bgd el ekhtyar el sah ele kul bent btstna enha tla2eh w Ana hazy ene l2etk w b2et m3ak f bgd kanet sana hasal feha mwakef kter ghreba w mshakl kter w khna2at w sebna kter awy bs f el akhr f kul mara kan bynthe bena el hal w ehna naymen m3 ba3d f el call aashna ntamn bhs b3dena l2nna aarfen enna mlnash gher ba3d f ana bgd bhbk awy w bhb el sodfa ele gam3tna el 3raftne aalek w el kadar el gam3ne bek w khalak hbebe f shokran enk kunt argl ragel mmkn 3ene tshufo w ahn alb aalya w a2rb hd lya f kul haga shokan enk kunt kul nasy f 3ez ma ana mkansh hwalya hd shokran enk kunt amany w dr3 lya f denia mbt3mlsh haga gher enha tege aalya w shokran enk mwgod w shokran enk hbibi w rbna ykhlek lya ya rb ya hbibi w n3esh el snen ele gya de kulha swa ya rb.♥️";

export const defaultLoveLetterParagraphs: string[] = [
  "hnytak w tebtak",
  "Gd3ntak w rgoltak",
  "enk t3rf rbna W orayb mno",
  "Kheft damk",
  "enk bgd mohtrm w ebn nas w ndef msh zy mo3zm ele f gelna",
  "enk mhafz aalya w mhawshne l el most2bal",
  "yo3tmd aalek w tenfa3 l meshwar el oomr",
  "enk bgd aayzne w btharb aashany",
];

const anasGift: GiftData = {
  senderName: "layla",
  receiverName: "Anas",
  envelopeImage: "/images/envelope-placeholder.png",
  cardMessage: "Check out these awesome surprises made just for you, Anas! ✨",
  birthdayImage: "/images/kid-placeholder.jpg",
  birthdayTitle: "To my favorite person,",
  birthdayText:
    "Our first movie together... I fell so deeply in love with the most handsome and precious man in my life. 🤍",
  balloonImage: "/images/cat.png",
  birthdayWishesTitle: "Happy 20th Birthday, Anas! 🎂✨",
  birthdayWishesMessage:
    "Happy 20th birthday to my favorite person and best future Dr! You make my whole world brighter with your laughter, warmth, and handsome smile. I’m so lucky to have you, and I can't wait to be by your side forever. Wishing you endless happiness, peace, and love. Happy birthday, Anas! 🤍✨",
  thingsWeWannaDo: defaultThings,
  loveLetterTitle: "Things i love about you",
  loveLetterSubtitle: "To My Anas, With All My Love <3",
  loveLetterParagraphs: defaultLoveLetterParagraphs,
  musicCoverImage: "/images/song-cover.jpg",
  musicUrl: "/music/our-song.mp3",
  songTitle: "Our Special Track",
  anniversaryTitle: "HAPPY 1ST ANNIVERSARY",
  anniversaryImage: "/images/anniversary.jpg",
  anniversaryTargetDate: "2025-11-15T00:00:00",
  anniversaryLetterTitle: "HAPPY 1st ANNIVERSARY NOSYYYY.",
  anniversaryLetterMessage: defaultAnniversaryMessage,
  ourBestMemories: defaultOurBestMemories,
  importantDates: defaultImportantDates,
  videoUrl: "/video.mp4",
};

const giftData: Record<string, GiftData> = {
  anas: anasGift,
  ahmed: anasGift,
  amir: anasGift,
  aya: {
    ...anasGift,
    senderName: "Aya",
    cardMessage: "Check out these awesome surprises for YOU!",
  },
};

export default giftData;