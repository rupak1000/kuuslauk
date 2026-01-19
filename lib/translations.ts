export type Language = "en" | "et" | "ru"

export const translations = {
  en: {
    // Header & Navigation
    nav: {
      menu: "Menu",
      fullCourse: "Full Course",
      hours: "Hours",
      reserve: "Reserve",
      location: "Location",
      orderWolt: "Order Wolt",
      orderBolt: "Order Bolt",
    },
    // Hero
    hero: {
      title1: "Authentic Flavors,",
      title2: "Fresh Every Day",
      subtitle: "Experience the perfect fusion of Asian wok cuisine and Mediterranean kebabs in the heart of Tallinn.",
      orderWolt: "Order on Wolt",
      orderBolt: "Order on Bolt",
    },
    // Menu
    menu: {
      title: "Our Menu",
      subtitle: "Fresh ingredients, bold flavors, and authentic recipes from Asia and the Mediterranean.",
      starters: "Starters",
      wokDishes: "Main Dishes (Wok)",
      kebabDishes: "Main Dishes (Kebab)",
      kidsMenu: "Kids Menu",
      desserts: "Desserts",
      spicy: "Spicy",
      extraHot: "Extra Hot",
      vegan: "Vegan",
      veganOption: "Vegetarian/Vegan option",
      featured: {
        wok: { name: "Wok Dishes", description: "Fresh ingredients stir-fried to perfection" },
        kebab: { name: "Kebab Plates", description: "Authentic Mediterranean flavors" },
        spring: { name: "Spring Rolls", description: "Crispy appetizers to start your meal" },
      },
    },
    // Full Course
    fullCourse: {
      title: "Full Course Menu",
      starter: "Starter",
      starterName: "Spring Rolls",
      starterDesc: "Light and crispy rolls served with a tangy dipping sauce.",
      mainCourse: "Main Course",
      mainCourseName: "Choose Your Favorite Wok",
      mainCourseDesc: "Select from the menu – freshly cooked with your preferred sauce.",
      dessert: "Dessert",
      dessertName: "Cheesecake",
      dessertDesc: "Smooth and creamy, served with a Jam.",
      drink: "Drink",
      drinkName: "Beer / Wine (12cl)",
      drinkDesc: "Choose your preferred drink to complement your meal.",
      orderWolt: "Order Full Course on Wolt",
      orderBolt: "Order Full Course on Bolt",
    },
    // Opening Hours
    hours: {
      title: "Opening Hours",
      winterSchedule: "Winter Schedule",
      monSat: "Monday – Saturday",
      sunday: "Sunday",
      welcomeMessage: "Come enjoy our warm dishes and cozy atmosphere even during winter!",
      waitingForYou: "WE ARE WAITING FOR YOU!",
    },
    // Reservation
    reservation: {
      title: "Reserve a Table",
      subtitle: "Book your table in advance for a guaranteed spot. We will confirm your reservation via email.",
      detailsTitle: "Reservation Details",
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      date: "Date",
      time: "Time",
      selectTime: "Select time",
      guests: "Guests",
      numberOfGuests: "Number of guests",
      guest: "Guest",
      guestsLabel: "Guests",
      menuPreference: "Preferred Menu",
      selectMenu: "Select menu preference (optional)",
      regularMenu: "Regular Menu",
      fullCourseMenu: "Full Course Menu (€21)",
      kidsMenuOption: "Kids Menu",
      notes: "Additional Notes",
      notesPlaceholder: "Any dietary requirements, special requests, or allergies...",
      submit: "Request Reservation",
      submitting: "Submitting...",
      confirmationNote: "We will send a confirmation email to you once your reservation is approved.",
      successTitle: "Reservation Request Sent!",
      successMessage: "Thank you for your reservation request. We will contact you shortly to confirm your booking.",
      makeAnother: "Make Another Reservation",
    },
    // Location
    location: {
      title: "Find Us",
      subtitle: "Visit us in Tallinn for a delicious meal",
      address: "Address",
      phone: "Phone",
      getDirections: "Get Directions on Google Maps",
      orderDelivery: "Order Delivery",
      orderWolt: "Order on Wolt",
      orderBolt: "Order on Bolt Food",
    },
    // Footer
    footer: {
      description: "Authentic Asian wok dishes and delicious kebabs in Tallinn, Estonia.",
      quickLinks: "Quick Links",
      contact: "Contact",
      orderOnline: "Order Online",
      rights: "All rights reserved.",
      reserveTable: "Reserve a Table",
    },
    // Menu Items
    menuItems: {
      wingsAndFries: "Wings & Fries",
      chickenDrumstick: "Chicken Drumstick 6tk",
      chickenWings: "Chicken Wings 6tk",
      crispyChilliChicken: "Crispy Chilli Chicken",
      chiliPrawn: "Chili Prawn 8tk",
      crispyVeggie: "Crispy Veggie in Hot Sauce",
      snackPlate: "Snack Plate 18tk",
      springRoll: "Spring Roll 6tk",
      honeyChickenWok: "Honey Chicken Wok",
      honeyChickenDesc: "Egg noodles, Egg, Cabbage, Carrot, Soy sauce, Sesame seeds, Crispy chicken in Honey sauce.",
      pekingChickenWok: "Peking Chicken Wok",
      pekingChickenDesc:
        "Egg noodles, Egg, Cabbage, Carrot, Paprika, Onion, Green onion, Soy sauce, Garlic slices, Crispy chicken in Peking sauce.",
      spicyNoodleWok: "Spicy Noodle Wok",
      spicyNoodleDesc:
        "Noodles, (Chicken/Beef/Pork/Shrimp/Tofu), Egg, Cabbage, Carrot, Paprika, Onion, Green beans, Green onion, Soy sauce, Garlic in Hot Garlic sauce.",
      coconutCurryWok: "Coconut Curry Wok",
      coconutCurryDesc:
        "Noodles, (Chicken/Beef/Pork/Shrimp/Tofu), Egg, Cabbage, Carrot, Soy sauce, Paprika, Mushroom, Onion, Green onion in Coconut Curry sauce.",
      chiliChickenWok: "Chili Chicken Wok",
      chiliChickenDesc:
        "Rice Noodles, Egg, Cabbage, Carrot, Soy sauce, Garlic, Paprika, Onion, Green onion, Broccoli Crispy chicken in Hot Chili sauce.",
      padThaiWok: "Pad Thai Wok",
      padThaiDesc:
        "Rice noodles, (Chicken/Beef/Pork/Shrimp/Tofu), Egg, Broccoli, Nuts, Paprika, Green onion in Pad Thai sauce.",
      blackPepperWok: "Black Pepper Wok",
      blackPepperDesc:
        "Egg noodles, (Chicken/Beef/Pork/Shrimp/Tofu), Egg, Cabbage, Carrot, Soy sauce, Paprika, Onion, Green onion in Black Pepper sauce.",
      oysterWok: "Oyster Wok",
      oysterWokDesc:
        "Basmati Rice, (Chicken/Beef/Pork/Shrimp/Tofu), Egg, Green Peas, Carrot, Soy sauce, Paprika, Mushroom, Onion, Green onion in Oyster sauce.",
      sichuanPepperWok: "Sichuan Pepper Wok",
      sichuanPepperDesc:
        "Basmati Rice, (Chicken/Beef/Pork/Shrimp/Tofu), Egg, Green Peas, Green beans, Carrot, Soy sauce, Paprika, Onion, Green onion in Sichuan sauce.",
      sweetSourWok: "Sweet and Sour Wok",
      sweetSourDesc:
        "Egg noodles, (Chicken/Beef/Pork/Shrimp/Tofu), Egg, Cabbage, Carrot, Soy sauce, Green Peas, Pineapple, Onion, Green onion in Sweet and Sour sauce.",
      morningSuffer: "Morning Suffer",
      morningSufferDesc:
        "Noodles, Chicken & Shrimp, Egg, Cabbage, Carrot, Soy sauce, Paprika, Onion, Mushroom, Green onion in Super Hotsauce (Habanero, Thai Chilli, Ghost Pepper, Cayenne Chilli, Naga Chilli).",
      kebabWrap: "Kebab Wrap",
      kebabWrapDesc:
        "Meat (Chicken/Beef/Mix/Falafel), Sauce (Garlic/Chili/Mix), Chinese cabbage, Cucumber, Tomato, Pickle, Onion. (Meal - 3€)",
      kebabPlate: "Kebab Plate",
      kebabPlateDesc:
        "Meat (Chicken/Beef/Mix/Falafel), Sauce (Garlic/Chili/Mix), Chinese cabbage, Cucumber, Tomato, Pickle, Onion. All served on a plate.",
      kebabBowl: "Kebab Bowl",
      kebabBowlDesc: "Meat (Chicken/Beef/Mix/Falafel), Sauce (Garlic/Chili/Mix), Pickle, Chili and Onion.",
      pitaKebab: "Pita Kebab",
      pitaKebabDesc:
        "Meat (Chicken/Beef/Mix/Falafel), Sauce (Garlic/Chili/Mix), Chinese cabbage, Cucumber, Tomato, Pickle, Onion. (Meal - 3€)",
      frenchFriesSausage: "French Fries Sausage",
      frenchFriesHoneyChicken: "French Fries / Noodles & Honey Chicken",
      cheesecakeJam: "Cheesecake with Jam",
      tiramisu: "Tiramisu",
    },
  },
  et: {
    // Header & Navigation
    nav: {
      menu: "Menüü",
      fullCourse: "Täismenüü",
      hours: "Lahtiolekuajad",
      reserve: "Broneeri",
      location: "Asukoht",
      orderWolt: "Telli Wolt",
      orderBolt: "Telli Bolt",
    },
    // Hero
    hero: {
      title1: "Autentsed maitsed,",
      title2: "Iga päev värskelt",
      subtitle: "Koge Aasia wok-köögi ja Vahemere kebabi täiuslikku sulandumist Tallinna südames.",
      orderWolt: "Telli Woltist",
      orderBolt: "Telli Boltist",
    },
    // Menu
    menu: {
      title: "Meie menüü",
      subtitle: "Värsked koostisosad, julged maitsed ja autentsed retseptid Aasiast ja Vahemerest.",
      starters: "Eelroad",
      wokDishes: "Põhiroad (Wok)",
      kebabDishes: "Põhiroad (Kebab)",
      kidsMenu: "Lastemenüü",
      desserts: "Magustoidud",
      spicy: "Vürtsikas",
      extraHot: "Eriti kuum",
      vegan: "Vegan",
      veganOption: "Taimetoitlaste/veganite valik",
      featured: {
        wok: { name: "Wok-road", description: "Värsked koostisosad täiuslikuks praetud" },
        kebab: { name: "Kebabi taldrikud", description: "Autentsed Vahemere maitsed" },
        spring: { name: "Kevadrulikesed", description: "Krõbedad suupisted alguseks" },
      },
    },
    // Full Course
    fullCourse: {
      title: "Täismenüü",
      starter: "Eelroog",
      starterName: "Kevadrulikesed",
      starterDesc: "Kerged ja krõbedad rulikesed tangise kastmega.",
      mainCourse: "Pearoog",
      mainCourseName: "Vali oma lemmik wok",
      mainCourseDesc: "Vali menüüst – värskelt valmistatud sinu eelistatud kastmega.",
      dessert: "Magustoit",
      dessertName: "Juustukook",
      dessertDesc: "Sile ja kreemjas, serveeritud moosiga.",
      drink: "Jook",
      drinkName: "Õlu / Vein (12cl)",
      drinkDesc: "Vali oma lemmisjook, mis sobib söögi juurde.",
      orderWolt: "Telli täismenüü Woltist",
      orderBolt: "Telli täismenüü Boltist",
    },
    // Opening Hours
    hours: {
      title: "Lahtiolekuajad",
      winterSchedule: "Talvine ajakava",
      monSat: "Esmaspäev – Laupäev",
      sunday: "Pühapäev",
      welcomeMessage: "Tule naudi meie sooje roogasid ja hubast õhkkonda ka talveperioodil!",
      waitingForYou: "OOTAME SIND!",
    },
    // Reservation
    reservation: {
      title: "Broneeri laud",
      subtitle: "Broneeri laud ette, et kindlustada koht. Kinnitame broneeringu e-posti teel.",
      detailsTitle: "Broneeringu andmed",
      fullName: "Täisnimi",
      email: "E-posti aadress",
      phone: "Telefoninumber",
      date: "Kuupäev",
      time: "Kellaaeg",
      selectTime: "Vali aeg",
      guests: "Külalised",
      numberOfGuests: "Külaliste arv",
      guest: "Külaline",
      guestsLabel: "Külalist",
      menuPreference: "Eelistatud menüü",
      selectMenu: "Vali menüü eelistus (valikuline)",
      regularMenu: "Tavaline menüü",
      fullCourseMenu: "Täismenüü (€21)",
      kidsMenuOption: "Lastemenüü",
      notes: "Lisamärkused",
      notesPlaceholder: "Dieedinõuded, eripäringud või allergiad...",
      submit: "Saada broneeringutaotlus",
      submitting: "Saatmine...",
      confirmationNote: "Saadame kinnituse e-kirja, kui broneering on heaks kiidetud.",
      successTitle: "Broneeringutaotlus saadetud!",
      successMessage: "Täname broneeringu eest. Võtame teiega peagi ühendust broneeringu kinnitamiseks.",
      makeAnother: "Tee uus broneering",
    },
    // Location
    location: {
      title: "Leia meid",
      subtitle: "Külasta meid Tallinnas maitsvaks eineks",
      address: "Aadress",
      phone: "Telefon",
      getDirections: "Vaata juhiseid Google Mapsis",
      orderDelivery: "Telli kohaletoimetamine",
      orderWolt: "Telli Woltist",
      orderBolt: "Telli Bolt Foodist",
    },
    // Footer
    footer: {
      description: "Autentsed Aasia wok-road ja maitsvad kebabid Tallinnas, Eestis.",
      quickLinks: "Kiirlingid",
      contact: "Kontakt",
      orderOnline: "Telli online",
      rights: "Kõik õigused kaitstud.",
      reserveTable: "Broneeri laud",
    },
    // Menu Items (Estonian)
    menuItems: {
      wingsAndFries: "Tiivad & Friikartulid",
      chickenDrumstick: "Kanakoivad 6tk",
      chickenWings: "Kanatiivad 6tk",
      crispyChilliChicken: "Krõbe tšillikana",
      chiliPrawn: "Tšilli krevetid 8tk",
      crispyVeggie: "Krõbedad köögiviljad tulises kastmes",
      snackPlate: "Snäkitaldrik 18tk",
      springRoll: "Kevadrulikesed 6tk",
      honeyChickenWok: "Mee-kana wok",
      honeyChickenDesc: "Munanudlid, muna, kapsas, porgand, sojakaste, seesamiseemned, krõbe kana meekastmes.",
      pekingChickenWok: "Pekingi kana wok",
      pekingChickenDesc:
        "Munanudlid, muna, kapsas, porgand, paprika, sibul, roheline sibul, sojakaste, küüslauguviilud, krõbe kana Pekingi kastmes.",
      spicyNoodleWok: "Vürtsikas nuudli wok",
      spicyNoodleDesc:
        "Nuudlid, (kana/veise/sea/kreveti/tofu), muna, kapsas, porgand, paprika, sibul, rohelised oad, roheline sibul, sojakaste, küüslauk tulises küüslaugukastmes.",
      coconutCurryWok: "Kookose-karri wok",
      coconutCurryDesc:
        "Nuudlid, (kana/veise/sea/kreveti/tofu), muna, kapsas, porgand, sojakaste, paprika, seened, sibul, roheline sibul kookose-karrikastmes.",
      chiliChickenWok: "Tšilli-kana wok",
      chiliChickenDesc:
        "Riisi nuudlid, muna, kapsas, porgand, sojakaste, küüslauk, paprika, sibul, roheline sibul, brokoli krõbe kana tulises tšillikastmes.",
      padThaiWok: "Pad Thai wok",
      padThaiDesc:
        "Riisi nuudlid, (kana/veise/sea/kreveti/tofu), muna, brokoli, pähklid, paprika, roheline sibul Pad Thai kastmes.",
      blackPepperWok: "Musta pipra wok",
      blackPepperDesc:
        "Munanudlid, (kana/veise/sea/kreveti/tofu), muna, kapsas, porgand, sojakaste, paprika, sibul, roheline sibul musta pipra kastmes.",
      oysterWok: "Austri wok",
      oysterWokDesc:
        "Basmati riis, (kana/veise/sea/kreveti/tofu), muna, rohelised herned, porgand, sojakaste, paprika, seened, sibul, roheline sibul austrikastmes.",
      sichuanPepperWok: "Sichuani pipra wok",
      sichuanPepperDesc:
        "Basmati riis, (kana/veise/sea/kreveti/tofu), muna, rohelised herned, rohelised oad, porgand, sojakaste, paprika, sibul, roheline sibul Sichuani kastmes.",
      sweetSourWok: "Magushapus wok",
      sweetSourDesc:
        "Munanudlid, (kana/veise/sea/kreveti/tofu), muna, kapsas, porgand, sojakaste, rohelised herned, ananass, sibul, roheline sibul magushapus kastmes.",
      morningSuffer: "Hommikune kannatus",
      morningSufferDesc:
        "Nuudlid, kana & krevetid, muna, kapsas, porgand, sojakaste, paprika, sibul, seened, roheline sibul supertulises kastmes (Habanero, Tai tšilli, Ghost Pepper, Cayenne tšilli, Naga tšilli).",
      kebabWrap: "Kebabi wrap",
      kebabWrapDesc:
        "Liha (kana/veise/mix/falafel), kaste (küüslauk/tšilli/mix), hiina kapsas, kurk, tomat, marineeritud kurk, sibul. (Eine - 3€)",
      kebabPlate: "Kebabi taldrik",
      kebabPlateDesc:
        "Liha (kana/veise/mix/falafel), kaste (küüslauk/tšilli/mix), hiina kapsas, kurk, tomat, marineeritud kurk, sibul. Kõik serveeritud taldrikul.",
      kebabBowl: "Kebabi kauss",
      kebabBowlDesc: "Liha (kana/veise/mix/falafel), kaste (küüslauk/tšilli/mix), marineeritud kurk, tšilli ja sibul.",
      pitaKebab: "Pita kebab",
      pitaKebabDesc:
        "Liha (kana/veise/mix/falafel), kaste (küüslauk/tšilli/mix), hiina kapsas, kurk, tomat, marineeritud kurk, sibul. (Eine - 3€)",
      frenchFriesSausage: "Friikartulid ja vorstike",
      frenchFriesHoneyChicken: "Friikartulid / Nuudlid & meekana",
      cheesecakeJam: "Juustukook moosiga",
      tiramisu: "Tiramisu",
    },
  },
  ru: {
    // Header & Navigation
    nav: {
      menu: "Меню",
      fullCourse: "Полный курс",
      hours: "Часы работы",
      reserve: "Бронь",
      location: "Адрес",
      orderWolt: "Заказать Wolt",
      orderBolt: "Заказать Bolt",
    },
    // Hero
    hero: {
      title1: "Настоящие вкусы,",
      title2: "Свежие каждый день",
      subtitle:
        "Откройте для себя идеальное сочетание азиатской кухни вок и средиземноморского кебаба в самом сердце Таллинна.",
      orderWolt: "Заказать в Wolt",
      orderBolt: "Заказать в Bolt",
    },
    // Menu
    menu: {
      title: "Наше меню",
      subtitle: "Свежие ингредиенты, яркие вкусы и аутентичные рецепты из Азии и Средиземноморья.",
      starters: "Закуски",
      wokDishes: "Основные блюда (Вок)",
      kebabDishes: "Основные блюда (Кебаб)",
      kidsMenu: "Детское меню",
      desserts: "Десерты",
      spicy: "Острое",
      extraHot: "Очень острое",
      vegan: "Веган",
      veganOption: "Вегетарианский/веганский вариант",
      featured: {
        wok: { name: "Блюда вок", description: "Свежие ингредиенты, обжаренные до совершенства" },
        kebab: { name: "Тарелки кебаба", description: "Аутентичные средиземноморские вкусы" },
        spring: { name: "Спринг роллы", description: "Хрустящие закуски для начала трапезы" },
      },
    },
    // Full Course
    fullCourse: {
      title: "Полный курс",
      starter: "Закуска",
      starterName: "Спринг роллы",
      starterDesc: "Легкие и хрустящие роллы с пикантным соусом для макания.",
      mainCourse: "Основное блюдо",
      mainCourseName: "Выберите свой любимый вок",
      mainCourseDesc: "Выберите из меню – свежеприготовленное с вашим любимым соусом.",
      dessert: "Десерт",
      dessertName: "Чизкейк",
      dessertDesc: "Нежный и кремовый, подается с джемом.",
      drink: "Напиток",
      drinkName: "Пиво / Вино (12cl)",
      drinkDesc: "Выберите напиток, который дополнит вашу трапезу.",
      orderWolt: "Заказать полный курс в Wolt",
      orderBolt: "Заказать полный курс в Bolt",
    },
    // Opening Hours
    hours: {
      title: "Часы работы",
      winterSchedule: "Зимний график",
      monSat: "Понедельник – Суббота",
      sunday: "Воскресенье",
      welcomeMessage: "Приходите наслаждаться нашими теплыми блюдами и уютной атмосферой даже зимой!",
      waitingForYou: "МЫ ВАС ЖДЁМ!",
    },
    // Reservation
    reservation: {
      title: "Забронировать столик",
      subtitle:
        "Забронируйте столик заранее для гарантированного места. Мы подтвердим бронирование по электронной почте.",
      detailsTitle: "Детали бронирования",
      fullName: "Полное имя",
      email: "Электронная почта",
      phone: "Номер телефона",
      date: "Дата",
      time: "Время",
      selectTime: "Выберите время",
      guests: "Гости",
      numberOfGuests: "Количество гостей",
      guest: "Гость",
      guestsLabel: "Гостей",
      menuPreference: "Предпочтение меню",
      selectMenu: "Выберите предпочтение меню (необязательно)",
      regularMenu: "Обычное меню",
      fullCourseMenu: "Полный курс (€21)",
      kidsMenuOption: "Детское меню",
      notes: "Дополнительные примечания",
      notesPlaceholder: "Диетические требования, особые пожелания или аллергии...",
      submit: "Отправить запрос на бронирование",
      submitting: "Отправка...",
      confirmationNote: "Мы отправим подтверждение на электронную почту после одобрения бронирования.",
      successTitle: "Запрос на бронирование отправлен!",
      successMessage: "Спасибо за бронирование. Мы свяжемся с вами в ближайшее время для подтверждения.",
      makeAnother: "Сделать новое бронирование",
    },
    // Location
    location: {
      title: "Найдите нас",
      subtitle: "Посетите нас в Таллинне для вкусной еды",
      address: "Адрес",
      phone: "Телефон",
      getDirections: "Открыть в Google Maps",
      orderDelivery: "Заказать доставку",
      orderWolt: "Заказать в Wolt",
      orderBolt: "Заказать в Bolt Food",
    },
    // Footer
    footer: {
      description: "Аутентичные азиатские блюда вок и вкусные кебабы в Таллинне, Эстония.",
      quickLinks: "Быстрые ссылки",
      contact: "Контакты",
      orderOnline: "Заказать онлайн",
      rights: "Все права защищены.",
      reserveTable: "Забронировать столик",
    },
    // Menu Items (Russian)
    menuItems: {
      wingsAndFries: "Крылышки и картофель фри",
      chickenDrumstick: "Куриные голени 6шт",
      chickenWings: "Куриные крылышки 6шт",
      crispyChilliChicken: "Хрустящая курица чили",
      chiliPrawn: "Креветки чили 8шт",
      crispyVeggie: "Хрустящие овощи в остром соусе",
      snackPlate: "Закусочная тарелка 18шт",
      springRoll: "Спринг роллы 6шт",
      honeyChickenWok: "Вок с медовой курицей",
      honeyChickenDesc: "Яичная лапша, яйцо, капуста, морковь, соевый соус, кунжут, хрустящая курица в медовом соусе.",
      pekingChickenWok: "Пекинская курица вок",
      pekingChickenDesc:
        "Яичная лапша, яйцо, капуста, морковь, паприка, лук, зеленый лук, соевый соус, чеснок, хрустящая курица в пекинском соусе.",
      spicyNoodleWok: "Острая лапша вок",
      spicyNoodleDesc:
        "Лапша, (курица/говядина/свинина/креветки/тофу), яйцо, капуста, морковь, паприка, лук, стручковая фасоль, зеленый лук, соевый соус, чеснок в остром чесночном соусе.",
      coconutCurryWok: "Кокосовый карри вок",
      coconutCurryDesc:
        "Лапша, (курица/говядина/свинина/креветки/тофу), яйцо, капуста, морковь, соевый соус, паприка, грибы, лук, зеленый лук в кокосовом карри соусе.",
      chiliChickenWok: "Курица чили вок",
      chiliChickenDesc:
        "Рисовая лапша, яйцо, капуста, морковь, соевый соус, чеснок, паприка, лук, зеленый лук, брокколи, хрустящая курица в остром соусе чили.",
      padThaiWok: "Пад тай вок",
      padThaiDesc:
        "Рисовая лапша, (курица/говядина/свинина/креветки/тофу), яйцо, брокколи, орехи, паприка, зеленый лук в соусе пад тай.",
      blackPepperWok: "Вок с черным перцем",
      blackPepperDesc:
        "Яичная лапша, (курица/говядина/свинина/креветки/тофу), яйцо, капуста, морковь, соевый соус, паприка, лук, зеленый лук в соусе с черным перцем.",
      oysterWok: "Устричный вок",
      oysterWokDesc:
        "Рис басмати, (курица/говядина/свинина/креветки/тофу), яйцо, зеленый горошек, морковь, соевый соус, паприка, грибы, лук, зеленый лук в устричном соусе.",
      sichuanPepperWok: "Сычуаньский вок",
      sichuanPepperDesc:
        "Рис басмати, (курица/говядина/свинина/креветки/тофу), яйцо, зеленый горошек, стручковая фасоль, морковь, соевый соус, паприка, лук, зеленый лук в сычуаньском соусе.",
      sweetSourWok: "Кисло-сладкий вок",
      sweetSourDesc:
        "Яичная лапша, (курица/говядина/свинина/креветки/тофу), яйцо, капуста, морковь, соевый соус, зеленый горошек, ананас, лук, зеленый лук в кисло-сладком соусе.",
      morningSuffer: "Утреннее страдание",
      morningSufferDesc:
        "Лапша, курица и креветки, яйцо, капуста, морковь, соевый соус, паприка, лук, грибы, зеленый лук в супер-остром соусе (Хабанеро, Тайский чили, Ghost Pepper, Кайенский чили, Нага чили).",
      kebabWrap: "Кебаб ролл",
      kebabWrapDesc:
        "Мясо (курица/говядина/микс/фалафель), соус (чесночный/чили/микс), пекинская капуста, огурец, помидор, маринованный огурец, лук. (Комбо - 3€)",
      kebabPlate: "Кебаб тарелка",
      kebabPlateDesc:
        "Мясо (курица/говядина/микс/фалафель), соус (чесночный/чили/микс), пекинская капуста, огурец, помидор, маринованный огурец, лук. Все на тарелке.",
      kebabBowl: "Кебаб боул",
      kebabBowlDesc:
        "Мясо (курица/говядина/микс/фалафель), соус (чесночный/чили/микс), маринованный огурец, чили и лук.",
      pitaKebab: "Пита кебаб",
      pitaKebabDesc:
        "Мясо (курица/говядина/микс/фалафель), соус (чесночный/чили/микс), пекинская капуста, огурец, помидор, маринованный огурец, лук. (Комбо - 3€)",
      frenchFriesSausage: "Картофель фри с сосиской",
      frenchFriesHoneyChicken: "Картофель фри / Лапша и медовая курица",
      cheesecakeJam: "Чизкейк с джемом",
      tiramisu: "Тирамису",
    },
  },
}

export function getTranslation(lang: Language) {
  return translations[lang]
}
