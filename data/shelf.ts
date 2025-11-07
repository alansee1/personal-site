export interface Book {
  title: string;
  author: string;
  dateFinished: string; // Date when finished reading (YYYY-MM-DD format)
  rating?: number; // Optional personal rating out of 10
  description?: string;
  link?: string;
  coverUrl?: string; // Book cover image URL
  isbn?: string; // ISBN for fetching cover if no coverUrl
  genres?: string[]; // Book genres/categories
  pageCount?: number; // Number of pages
}

export interface Game {
  title: string;
  description: string;
  playLink: string;
  thumbnail?: string;
}

export interface ShelfData {
  books: Book[];
  games: Game[];
}

export const shelfData: ShelfData = {
  books: [
    {
      title: "The Wise Man's Fear",
      author: "Patrick Rothfuss",
      dateFinished: "2025-11-07",
      coverUrl: "https://books.google.com/books/content?id=6FmJEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9781101486405",
      genres: ["Fiction"],
      pageCount: 1010,
      description: "Discover book two of Patrick Rothfuss' #1 New York Times-bestselling epic fantasy series, The Kingkiller Chronicle. \"I just love the world of Patrick Rothfuss.\" —Lin-Manuel Miranda DAY TWO: THE WISE MAN'S FEAR \"There are three things all wise men fear: the sea in storm, a night with no moon, and ..."
    },

    {
      title: "I Regret Almost Everything",
      author: "Keith McNally",
      dateFinished: "2025-10-11",
      coverUrl: "https://books.google.com/books/content?id=nKatEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9781668017661",
      genres: ["Biography & Autobiography"],
      pageCount: 320,
      description: "New York Times Bestseller The entertaining, irreverent, and surprisingly moving memoir by the visionary restaurateur behind such iconic New York institutions as Balthazar and Pastis. A memoir by the legendary proprietor of Balthazar, Pastis, Minetta Tavern, and Morandi, taking us from his gritty Lon..."
    },
{
      title: "No Country for Old Men",
      author: "Cormac McCarthy",
      dateFinished: "2025-09-13",
      coverUrl: "https://books.google.com/books/content?id=2dMjk9DTt4wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9780307277039",
      genres: ["Drug traffic"],
      pageCount: 322,
      description: "Stumbling upon a bloody massacre, a cache of heroin, and more than two million in cash during a hunting trip, Llewelyn Moss removes the money, a decision that draws him and his young wife into the middle of a violent confrontation."
    },
{
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
      dateFinished: "2025-08-15",
      coverUrl: "https://books.google.com/books/content?id=7y6JEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9780756413712",
      genres: ["Fiction"],
      pageCount: 754,
      description: "An illustrated, 10th anniversary edition of the New York Times best-selling fantasy novel describes how the magically gifted orphan, Kvothe, brazenly attends a legendary school of magic and must live as a fugitive after the murder of a king."
    },
{
      title: "Magpie Murders",
      author: "Anthony Horowitz",
      dateFinished: "2025-07-29",
      coverUrl: "https://books.google.com/books/content?id=Fz0YDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9780062645241",
      genres: ["Fiction"],
      pageCount: 533,
      description: "Don’t miss Magpie Murders on PBS's MASTERPIECE Mystery! \"A double puzzle for puzzle fans, who don’t often get the classicism they want from contemporary thrillers.\" —Janet Maslin, The New York Times New York Times Bestseller | Winner of the Macavity Award for Best Novel | NPR Best Book of the Year..."
    },
{
      title: "The Crystal City",
      author: "Orson Scott Card",
      dateFinished: "2025-07-26",
      coverUrl: "https://books.google.com/books/content?id=31hJjP2RLkwC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9781429964500",
      genres: ["Fiction"],
      pageCount: 385,
      description: "The Tales of Alvin Maker continue in The Crystal City, the sixth book in the historical fantasy series from the Hugo and Nebula award-winning and New York Times bestselling author of Ender's Game. Using the lore and the folk-magic of the men and women who settled North America, Orson Scott Card has ..."
    },
{
      title: "Heartfire",
      author: "Orson Scott Card",
      dateFinished: "2025-07-25",
      coverUrl: "https://books.google.com/books/content?id=Q9PtsAIlZ0sC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9781429964654",
      genres: ["Fiction"],
      pageCount: 350,
      description: "The Tales of Alvin Maker continue in Heartfire, the fifth book in the historical fantasy series from the Hugo and Nebula award-winning and New York Times bestselling author of Ender's Game. Peggy is a Torch, able to see the fire burning in each person's heart. She can follow the paths of each person..."
    },
{
      title: "Zero to One",
      author: "Peter Thiel",
      dateFinished: "2025-07-20",
      coverUrl: "https://books.google.com/books/content?id=POOJDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9780804139298",
      genres: ["Business & Economics"],
      pageCount: 225,
      description: "#1 NEW YORK TIMES BESTSELLER • “This book delivers completely new and refreshing ideas on how to create value in the world.”—Mark Zuckerberg, CEO of Meta “Peter Thiel has built multiple breakthrough companies, and Zero to One shows how.”—Elon Musk, CEO of SpaceX and Tesla The great secret of our tim..."
    },
{
      title: "Alvin Journeyman",
      author: "Orson Scott Card",
      dateFinished: "2025-07-17",
      coverUrl: "https://books.google.com/books/content?id=wJzmAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9780812509236",
      genres: ["Fiction"],
      pageCount: 417,
      description: "Fantasy-roman."
    },
{
      title: "Prentice Alvin",
      author: "Orson Scott Card",
      dateFinished: "2025-07-13",
      coverUrl: "https://books.google.com/books/content?id=Cp3mAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9780812502121",
      genres: ["Fiction"],
      pageCount: 351,
      description: "The Tales of Alvin Maker series continues in volume three, Prentice Alvin. Young Alvin returns to the town of his birth, and begins his apprenticeship with Makepeace Smith, committing seven years of his life in exchange for the skills and knowledge of a blacksmith. But Alvin must also learn to contr..."
    },
{
      title: "His Excellency: George Washington",
      author: "Joseph J. Ellis",
      dateFinished: "2025-07-06",
      coverUrl: "https://books.google.com/books/content?id=jFtVf_Iz7vcC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9781400043767",
      genres: ["Biography & Autobiography"],
      pageCount: 309,
      description: "National Bestseller To this landmark biography of our first president, Joseph J. Ellis brings the exacting scholarship, shrewd analysis, and lyric prose that have made him one of the premier historians of the Revolutionary era. Training his lens on a figure who sometimes seems as remote as his effig..."
    },
{
      title: "Red Prophet",
      author: "Orson Scott Card",
      dateFinished: "2025-07-05",
      coverUrl: "https://books.google.com/books/content?id=O4uh6XaBu-IC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9781429964838",
      genres: ["Fiction"],
      pageCount: 321,
      description: "The Tales of Alvin Maker continue in Red Prophet, the second book in the historical fantasy series from the Hugo and Nebula award-winning and New York Times bestselling author of Ender's Game. Since the age of eleven, when he saw the white men murder his father, the Red Indian Lolla-Wossiky has been..."
    },
{
      title: "The Man Who Outshone the Sun King",
      author: "Charles Drazin",
      dateFinished: "2025-07-04",
      coverUrl: "https://books.google.com/books/content?id=xd3FrZB5e-oC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9780786726462",
      genres: ["History"],
      pageCount: 362,
      description: "Late in 1664, the musketeer D'Artagnan rode beside a carriage as it left Paris, carrying his friend Nicolas Fouquet to life imprisonment in a cell next door to the Man in the Iron Mask. From a glorious zenith as Louis XIV's first minister and Cardinal Mazarin's proté and eventual protector; builder ..."
    },
{
      title: "Will",
      author: "Will Smith",
      dateFinished: "2025-06-22",
      coverUrl: "https://books.google.com/books/content?id=ofaZEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9786067892864",
      genres: ["Biography & Autobiography"],
      pageCount: 426,
      description: "Una dintre forțele cele mai dinamice din divertismentul contemporan, recunoscută la nivel global, își povestește viața într-o carte deopotrivă curajoasă și motivantă, care îi urmărește parcursul de învățare până în punctul alinierii perfecte a succesului exterior, fericirii interioare și conexiunii ..."
    },
{
      title: "The Man Who Broke the Bank at Monte Carlo",
      author: "Robin Quinn",
      dateFinished: "2025-06-15",
      coverUrl: "https://books.google.com/books/content?id=lTiNDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9780750969260",
      genres: ["True Crime"],
      pageCount: 244,
      description: "THE INCREDIBLE TRUE STORY OF THE MAN WHO BROKE THE BANK AT MONTE CARLO. 'Brilliant – a terrific read' - Michael Aspel OBE 'The best book I've read all year' - Nigel Jones, editor, Devonshire Magazine Charles Deville Wells broke the bank at Monte Carlo – not once but ten times – winning the equivalen..."
    },
{
      title: "Miss Peregrine's Home for Peculiar Children",
      author: "Ransom Riggs",
      dateFinished: "2025-06-08",
      coverUrl: "https://books.google.com/books/content?id=pkGqafH1V40C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9781594745133",
      genres: ["Young Adult Fiction"],
      pageCount: 358,
      description: "The #1 New York Times best-selling series An abandoned orphanage on a mysterious island holds the key to supernatural secrets in this unusual and original first book in the one-of-a-kind Miss Peregrine’s Peculiar Children series A captivating blend of horror, dark fantasy, paranormal mystery, and ti..."
    },
{
      title: "The Wager",
      author: "David Grann",
      dateFinished: "2025-06-02",
      coverUrl: "https://books.google.com/books/content?id=Zn41EQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9780307742490",
      genres: ["True Crime"],
      pageCount: 449,
      description: "A “TOUR DE FORCE OF NARRATIVE NONFICTION” (WSJ) WITH OVER ONE YEAR ON THE NYT BEST SELLER LIST From the author of Killers of the Flower Moon, a page-turning story of shipwreck, survival, and savagery, culminating in a court martial that reveals a shocking truth. The powerful narrative reveals the de..."
    },
{
      title: "Bitcoin Billionaires",
      author: "Ben Mezrich",
      dateFinished: "2025-05-23",
      coverUrl: "https://books.google.com/books/content?id=IrZrDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9781250217752",
      genres: ["Biography & Autobiography"],
      pageCount: 252,
      description: "From Ben Mezrich, the New York Times bestselling author of The Accidental Billionaires and Bringing Down the House, comes Bitcoin Billionaires--the fascinating story of brothers Tyler and Cameron Winklevoss's big bet on crypto-currency and its dazzling pay-off. Ben Mezrich's 2009 bestseller The Acci..."
    },
{
      title: "The Snowball",
      author: "Alice Schroeder",
      dateFinished: "2025-05-19",
      coverUrl: "https://books.google.com/books/content?id=sfWWqwtzK3gC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9780747591917",
      genres: ["Business & Economics"],
      pageCount: 832,
      description: "The biography of the world's richest man and the only book on Warren Buffett that has his full cooperation."
    },
{
      title: "That Will Never Work",
      author: "Marc Randolph",
      dateFinished: "2025-04-14",
      coverUrl: "https://books.google.com/books/content?id=m4aSDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9780316530217",
      genres: ["Business & Economics"],
      pageCount: 320,
      description: "In the tradition of Phil Knight's Shoe Dog comes the incredible untold story of how Netflix went from concept to company-all revealed by co-founder and first CEO Marc Randolph. Once upon a time, brick-and-mortar video stores were king. Late fees were ubiquitous, video-streaming unheard was of, and w..."
    },
{
      title: "Throne of Glass",
      author: "Sarah J. Maas",
      dateFinished: "2025-03-28",
      coverUrl: "https://books.google.com/books/content?id=r_i4_Lr5fA4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9781619630345",
      genres: ["Young Adult Fiction"],
      pageCount: 434,
      description: "After she has served a year of hard labor in the salt mines of Endovier for her crimes, Crown Prince Dorian offers assassin Celaena Sardothien her freedom on the condition that she act as his champion in a competition to find a new royal assassin."
    },
{
      title: "The Assassin's Blade",
      author: "Sarah J. Maas",
      dateFinished: "2025-03-28",
      coverUrl: "https://books.google.com/books/content?id=xLacAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9781408851982",
      genres: ["Juvenile Fiction"],
      pageCount: 465,
      description: "Celaena Sardothien is Adarlan's most feared assassin. As part of the Assassins' Guild, her allegiance is to her master, Arobynn Hamel, yet Celaena listens to no one and trusts only her fellow killer-for-hire, Sam. In these action-packed prequel novellas - together in one edition for the first time -..."
    },
{
      title: "A Court of Wings and Ruin",
      author: "Sarah J. Maas",
      dateFinished: "2025-01-23",
      coverUrl: "https://books.google.com/books/content?id=4fZaEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      isbn: "9781619635203",
      genres: ["Fiction"],
      pageCount: 739,
      description: "Sarah J. Maas hit the New York Times SERIES list at #1 with A Court of Wings and Ruin!"
    }
  
  ],
  games: [
    {
      title: "Cosmic Drift",
      description: "Navigate through space avoiding asteroids",
      playLink: "/projects/cosmic-drift"
    }
  ]
};
