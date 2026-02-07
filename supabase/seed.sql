-- Seed data for VINO12
-- Import 12 wines from the original JSON collection

-- Regions
INSERT INTO regions (id, name, country) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Bourgogne', 'Frankrijk'),
  ('a1000000-0000-0000-0000-000000000002', 'Beaujolais', 'Frankrijk'),
  ('a1000000-0000-0000-0000-000000000003', 'Côtes du Rhône', 'Frankrijk'),
  ('a1000000-0000-0000-0000-000000000004', 'Saint-Émilion', 'Frankrijk'),
  ('a1000000-0000-0000-0000-000000000005', 'Loire Valley', 'Frankrijk'),
  ('a1000000-0000-0000-0000-000000000006', 'Mendoza', 'Argentinië'),
  ('a1000000-0000-0000-0000-000000000007', 'Marlborough', 'Nieuw-Zeeland'),
  ('a1000000-0000-0000-0000-000000000008', 'Rías Baixas', 'Spanje'),
  ('a1000000-0000-0000-0000-000000000009', 'Gallura', 'Italië'),
  ('a1000000-0000-0000-0000-000000000010', 'Chablis', 'Frankrijk'),
  ('a1000000-0000-0000-0000-000000000011', 'Condrieu', 'Frankrijk'),
  ('a1000000-0000-0000-0000-000000000012', 'Alsace', 'Frankrijk');

-- Grapes
INSERT INTO grapes (id, name) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Pinot Noir'),
  ('b1000000-0000-0000-0000-000000000002', 'Gamay'),
  ('b1000000-0000-0000-0000-000000000003', 'Grenache'),
  ('b1000000-0000-0000-0000-000000000004', 'Merlot'),
  ('b1000000-0000-0000-0000-000000000005', 'Cabernet Franc'),
  ('b1000000-0000-0000-0000-000000000006', 'Cabernet Sauvignon'),
  ('b1000000-0000-0000-0000-000000000007', 'Sauvignon Blanc'),
  ('b1000000-0000-0000-0000-000000000008', 'Albariño'),
  ('b1000000-0000-0000-0000-000000000009', 'Vermentino'),
  ('b1000000-0000-0000-0000-000000000010', 'Chardonnay'),
  ('b1000000-0000-0000-0000-000000000011', 'Viognier'),
  ('b1000000-0000-0000-0000-000000000012', 'Riesling');

-- Wines (12 wines from the original collection)
INSERT INTO wines (id, name, slug, description, type, body, region_id, vintage, alcohol_percentage, price_cents, image_url, is_active, is_featured, tasting_notes, food_pairing, stock_quantity, volume_ml) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Pinot Noir', 'pinot-noir-bourgogne',
   'Elegant en verfijnd. Rode kersen, aardbeien en een subtiele aardse toon. De Bourgogne in een glas.',
   'red', 'light', 'a1000000-0000-0000-0000-000000000001', 2022, 12.5, 1500,
   '/images/wines/pinot-noir-bourgogne.svg', true, true,
   'Neus: Rode kers, Aardbei, Viooltje. Smaak: Zijdezacht, Rode vruchten, Licht kruidig. Afdronk: Middellang, elegant met zachte tannines.',
   'Gegrilde zalm, Brie, Paddenstoelrisotto', 100, 750),

  ('c1000000-0000-0000-0000-000000000002', 'Gamay', 'gamay-beaujolais',
   'Fris, fruitig en onweerstaanbaar. Cru Beaujolais op z''n best — geen nouveau, maar serieuze wijn met speelse charme.',
   'red', 'light', 'a1000000-0000-0000-0000-000000000002', 2023, 12.0, 1300,
   '/images/wines/gamay-beaujolais.svg', true, false,
   'Neus: Framboos, Banaan, Peony. Smaak: Sappig, Framboos, Mineraal. Afdronk: Kort en verfrissend met een fruitige afdronk.',
   'Charcuterie, Quiche Lorraine, Lichte pasta', 100, 750),

  ('c1000000-0000-0000-0000-000000000003', 'Grenache', 'grenache-cotes-du-rhone',
   'Warm en genereus. Rijp rood fruit met kruiden uit de Provençaalse garrigue. Pure zonneschijn.',
   'red', 'medium_light', 'a1000000-0000-0000-0000-000000000003', 2022, 13.5, 1200,
   '/images/wines/grenache-cotes-du-rhone.svg', true, false,
   'Neus: Rijpe kers, Lavendel, Witte peper. Smaak: Rond, Kersen, Kruiden, Licht peppig. Afdronk: Middellang, warm en kruidig.',
   'Lamskoteletjes, Ratatouille, Olijventapenade', 100, 750),

  ('c1000000-0000-0000-0000-000000000004', 'Merlot', 'merlot-saint-emilion',
   'Fluwelig en toegankelijk. Pruimen, chocolade en een vleugje vanille. Right Bank Bordeaux op z''n mooist.',
   'red', 'medium', 'a1000000-0000-0000-0000-000000000004', 2021, 13.5, 1600,
   '/images/wines/merlot-saint-emilion.svg', true, true,
   'Neus: Pruim, Chocolade, Vanille. Smaak: Fluweelzacht, Donker fruit, Mokka. Afdronk: Lang en rond met zachte tannines en cacao.',
   'Ossenhaas, Truffelrisotto, Belegen kaas', 100, 750),

  ('c1000000-0000-0000-0000-000000000005', 'Cabernet Franc', 'cabernet-franc-loire',
   'Expressief en kruidig. Paprika, cassis en een elegante structuur. De Loire''s best bewaarde geheim.',
   'red', 'medium_full', 'a1000000-0000-0000-0000-000000000005', 2022, 13.0, 1400,
   '/images/wines/cabernet-franc-loire.svg', true, false,
   'Neus: Paprika, Cassis, Violette. Smaak: Stevig, Braam, Groene peper, Grafiet. Afdronk: Lang met stevige tannines en een minerale afdronk.',
   'Eend, Geitenkaas, Gegrilde groenten', 100, 750),

  ('c1000000-0000-0000-0000-000000000006', 'Cabernet Sauvignon', 'cabernet-sauvignon-mendoza',
   'Krachtig en complex. Zwarte bes, eucalyptus en ceder. Hoge hoogte Mendoza geeft ongeëvenaarde diepte.',
   'red', 'full', 'a1000000-0000-0000-0000-000000000006', 2021, 14.0, 1500,
   '/images/wines/cabernet-sauvignon-mendoza.svg', true, true,
   'Neus: Zwarte bes, Eucalyptus, Cederhout. Smaak: Krachtig, Bramenjam, Tabak, Donkere chocolade. Afdronk: Zeer lang met stevige tannines, eik en zwart fruit.',
   'Rib-eye steak, Wild zwijn, Oude Gouda', 100, 750),

  ('c1000000-0000-0000-0000-000000000007', 'Sauvignon Blanc', 'sauvignon-blanc-marlborough',
   'Explosief fris. Passievrucht, limoen en gemaaid gras. De benchmark voor Sauvignon Blanc wereldwijd.',
   'white', 'light', 'a1000000-0000-0000-0000-000000000007', 2023, 12.5, 1300,
   '/images/wines/sauvignon-blanc-marlborough.svg', true, true,
   'Neus: Passievrucht, Limoen, Gemaaid gras. Smaak: Scherp, Citrus, Tropisch fruit, Mineraal. Afdronk: Crisp en verfrissend met een citrus afdronk.',
   'Oesters, Geitenkaas salade, Sushi', 100, 750),

  ('c1000000-0000-0000-0000-000000000008', 'Albariño', 'albarino-rias-baixas',
   'Atlantisch en mineraal. Witte perzik, citrus en zeebries. Galicië''s trots en de perfecte zomerwijn.',
   'white', 'light', 'a1000000-0000-0000-0000-000000000008', 2023, 12.5, 1400,
   '/images/wines/albarino-rias-baixas.svg', true, false,
   'Neus: Witte perzik, Citroenschil, Zeezout. Smaak: Fris, Perzik, Amandel, Ziltig. Afdronk: Middellang met een ziltige, minerale afdronk.',
   'Pulpo a la gallega, Zeevruchten, Manchego', 100, 750),

  ('c1000000-0000-0000-0000-000000000009', 'Vermentino', 'vermentino-gallura',
   'Mediterraan en aromatisch. Citrus, wilde kruiden en een licht bittere amandeltoon. Sardinië in een fles.',
   'white', 'medium_light', 'a1000000-0000-0000-0000-000000000009', 2023, 13.0, 1300,
   '/images/wines/vermentino-gallura.svg', true, false,
   'Neus: Citroen, Witte bloemen, Kruiden. Smaak: Fris, Groene appel, Amandel, Kruiden. Afdronk: Middellang met een licht bittere, kruidige afdronk.',
   'Pesto pasta, Gegrilde vis, Bruschetta', 100, 750),

  ('c1000000-0000-0000-0000-000000000010', 'Chardonnay', 'chardonnay-chablis',
   'Puur en ongehouted. Groene appel, vuursteenmineraliteit en een scherpe zuurgraad. Chablis is Chardonnay zonder make-up.',
   'white', 'medium', 'a1000000-0000-0000-0000-000000000010', 2022, 12.5, 1700,
   '/images/wines/chardonnay-chablis.svg', true, true,
   'Neus: Groene appel, Vuursteen, Citrus. Smaak: Strak, Mineraal, Citrusfruit, Krijtachtig. Afdronk: Lang en mineraal met een scherpe, schone afdronk.',
   'Bourgondische escargots, Zeebaars, Jonge Comté', 100, 750),

  ('c1000000-0000-0000-0000-000000000011', 'Viognier', 'viognier-condrieu',
   'Weelderig en bloemig. Abrikoos, oranjebloesem en honing. Condrieu is de meest verleidelijke witte wijn van de Rhône.',
   'white', 'medium_full', 'a1000000-0000-0000-0000-000000000011', 2022, 13.5, 1800,
   '/images/wines/viognier-condrieu.svg', true, false,
   'Neus: Abrikoos, Oranjebloesem, Honing. Smaak: Weelderig, Perzik, Gember, Oliachtig. Afdronk: Lang en warm met een bloemige, honingachtige afdronk.',
   'Foie gras, Kreeft, Curry', 100, 750),

  ('c1000000-0000-0000-0000-000000000012', 'Riesling', 'riesling-alsace',
   'Droog en complex. Petroleum, limoen en witte bloemen. Alsace Riesling bewijst dat droog ook diep kan zijn.',
   'white', 'full', 'a1000000-0000-0000-0000-000000000012', 2022, 13.0, 1500,
   '/images/wines/riesling-alsace.svg', true, true,
   'Neus: Petroleum, Limoen, Witte bloemen. Smaak: Droog, Citrus, Mineraal, Honingdauw. Afdronk: Zeer lang met een minerale, bijna zoute afdronk.',
   'Choucroute garnie, Aziatische keuken, Raclette', 100, 750);

-- Wine-Grape associations (100% single grape)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 100),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 100),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 100),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000004', 100),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000005', 100),
  ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000006', 100),
  ('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000007', 100),
  ('c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000008', 100),
  ('c1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000009', 100),
  ('c1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000010', 100),
  ('c1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000011', 100),
  ('c1000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000012', 100);

-- Categories
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Rode Wijn', 'rode-wijn', 'Alle rode wijnen', 1),
  ('d1000000-0000-0000-0000-000000000002', 'Witte Wijn', 'witte-wijn', 'Alle witte wijnen', 2),
  ('d1000000-0000-0000-0000-000000000003', 'VINO12 Box', 'vino12-box', 'De complete VINO12 collectie', 0);

-- Wine-Category associations
INSERT INTO wine_categories (wine_id, category_id) VALUES
  -- All reds in 'Rode Wijn' + 'VINO12 Box'
  ('c1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001'),
  ('c1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000003'),
  ('c1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001'),
  ('c1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000003'),
  ('c1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001'),
  ('c1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000003'),
  ('c1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001'),
  ('c1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000003'),
  ('c1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001'),
  ('c1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000003'),
  ('c1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000001'),
  ('c1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000003'),
  -- All whites in 'Witte Wijn' + 'VINO12 Box'
  ('c1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000003'),
  ('c1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000003'),
  ('c1000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000003'),
  ('c1000000-0000-0000-0000-000000000010', 'd1000000-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000010', 'd1000000-0000-0000-0000-000000000003'),
  ('c1000000-0000-0000-0000-000000000011', 'd1000000-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000011', 'd1000000-0000-0000-0000-000000000003'),
  ('c1000000-0000-0000-0000-000000000012', 'd1000000-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000012', 'd1000000-0000-0000-0000-000000000003');
