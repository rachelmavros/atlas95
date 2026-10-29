// Closest Wins for the Atlas95 Game Vault: seven estimation questions; the closer your number, the more points.
(()=>{
// [question, answer, kind, unit]; kind "y" is a year (2 points off per year), "n" is scored by ratio
const BANK=[
["How tall is Mount Everest?",8849,"n","meters"],
["How long is the Nile River?",6650,"n","km"],
["How tall is the Eiffel Tower, to the tip?",330,"n","meters"],
["How tall is the Burj Khalifa?",828,"n","meters"],
["How tall is the Empire State Building, to the tip?",443,"n","meters"],
["How tall was the Great Pyramid of Giza when it was built?",147,"n","meters"],
["How long is the main span of the Golden Gate Bridge?",1280,"n","meters"],
["How deep is the deepest point of the ocean (Challenger Deep)?",10935,"n","meters"],
["How wide is the Earth (its diameter)?",12742,"n","km"],
["How far away is the Moon, on average?",384400,"n","km"],
["How far is the Earth from the Sun, on average?",149600000,"n","km"],
["How fast does light travel?",299792,"n","km per second"],
["How fast does sound travel through air at sea level?",343,"n","meters per second"],
["How many bones are in an adult human body?",206,"n","bones"],
["How many keys are on a standard piano?",88,"n","keys"],
["How many Earth days long is a year on Mars?",687,"n","days"],
["How many steps go up to the top of the Eiffel Tower?",1665,"n","steps"],
["How many teeth does an adult human usually have, wisdom teeth included?",32,"n","teeth"],
["How deep is Lake Baikal, the world's deepest lake?",1642,"n","meters"],
["How big is the Sahara Desert?",9200000,"n","square km"],
["How big is the Pacific Ocean?",165000000,"n","square km"],
["How many people live on Earth?",8200000000,"n","people"],
["About how many islands make up Indonesia?",17000,"n","islands"],
["How tall is Angel Falls, the world's highest waterfall?",979,"n","meters"],
["How tall is Mount Kilimanjaro?",5895,"n","meters"],
["How hot is the surface of the Sun?",5500,"n","°C"],
["How old is the universe?",13.8,"n","billion years"],
["How old is the Earth?",4.54,"n","billion years"],
["How many liters of blood are in an adult human body?",5,"n","liters"],
["How long is a marathon?",42.195,"n","km"],
["How many seconds are in a day?",86400,"n","seconds"],
["How many hours are in a (non-leap) year?",8760,"n","hours"],
["How tall is the Christ the Redeemer statue in Rio, not counting its pedestal?",30,"n","meters"],
["How long is the Panama Canal?",82,"n","km"],
["How long is the Channel Tunnel between England and France?",50,"n","km"],
["How much does the Eiffel Tower weigh, in total?",10100,"n","tonnes"],
["How many spectators could the Roman Colosseum hold?",50000,"n","people"],
["How fast can a cheetah run at top speed?",110,"n","km/h"],
["How tall is an adult giraffe, roughly?",5.5,"n","meters"],
["How many days is an African elephant pregnant?",660,"n","days"],
["How long can a blue whale grow?",30,"n","meters"],
["How many hearts does an octopus have?",3,"n","hearts"],
["How many squares are on a chessboard's grid?",64,"n","squares"],
["How many member countries does the United Nations have?",193,"n","countries"],
["How many countries are in Africa?",54,"n","countries"],
["How many elements are on the periodic table?",118,"n","elements"],
["How long is the Great Barrier Reef?",2300,"n","km"],
["How long is the Great Wall of China, counting all its sections?",21196,"n","km"],
["How tall is the Statue of Liberty, from the ground to the torch?",93,"n","meters"],
["How tall is Big Ben's clock tower?",96,"n","meters"],
["How many times does a human heart beat in a day, roughly?",100000,"n","beats"],
["In what year did people first walk on the Moon?",1969,"y"],
["In what year did the Berlin Wall fall?",1989,"y"],
["In what year did the Titanic sink?",1912,"y"],
["In what year did Columbus first reach the Americas?",1492,"y"],
["In what year was the Magna Carta sealed?",1215,"y"],
["In what year was the US Declaration of Independence signed?",1776,"y"],
["In what year did the first iPhone come out?",2007,"y"],
["In what year was the Eiffel Tower finished?",1889,"y"],
["In what year did the Wright brothers make their first powered flight?",1903,"y"],
["In what year was the Great Fire of London?",1666,"y"],
["In what year did the French Revolution begin?",1789,"y"],
["In what year was the Battle of Hastings?",1066,"y"],
["In what year was William Shakespeare born?",1564,"y"],
["In what year did Mount Vesuvius bury Pompeii?",79,"y"],
["In what year were the first modern Olympic Games held?",1896,"y"],
["In what year did the Panama Canal open?",1914,"y"],
["In what year was Sputnik, the first satellite, launched?",1957,"y"],
["In what year was the Chernobyl disaster?",1986,"y"],
["In what year did euro coins and notes come into use?",2002,"y"],
["In what year was Google founded?",1998,"y"],
["In what year did Wikipedia launch?",2001,"y"],
["In what year was YouTube founded?",2005,"y"],
["In what year was Coca-Cola invented?",1886,"y"],
["In what year did Disneyland open?",1955,"y"],
["In what year did Alexander Graham Bell patent the telephone?",1876,"y"],
["In what year did Alexander Fleming discover penicillin?",1928,"y"],
["In what year was the Hubble Space Telescope launched?",1990,"y"],
["In what year did the Sydney Opera House open?",1973,"y"],
["In what year did the Western Roman Empire fall?",476,"y"],
["In what year did World War I begin?",1914,"y"],
["In what year did World War II end?",1945,"y"],
["In what year did the Beatles release their first album?",1963,"y"],
["In what year was the LEGO brick as we know it patented?",1958,"y"],
["In what year did Nelson Mandela become president of South Africa?",1994,"y"]];
// Question categories. Each game uses seven different ones. [question, answer, kind, unit]; kind "y" is a year, "n" is scored by ratio.
// Population, Area, US Presidents and Elements are built from the app's own data (see gen).
const CATS={
"Heights":[
["How tall is Mount Everest?",8849,"n","meters"],["How tall is the Eiffel Tower, to the tip?",330,"n","meters"],["How tall is the Burj Khalifa?",828,"n","meters"],
["How tall is the Empire State Building, to the tip?",443,"n","meters"],["How tall was the Great Pyramid of Giza when it was built?",147,"n","meters"],["How tall is Mount Kilimanjaro?",5895,"n","meters"],
["How tall is the Statue of Liberty, from the ground to the torch?",93,"n","meters"],["How tall is Big Ben's clock tower?",96,"n","meters"],["How tall is Denali, North America's highest peak?",6190,"n","meters"],
["How tall is the Leaning Tower of Pisa?",56,"n","meters"],["How tall is Seattle's Space Needle?",184,"n","meters"],["How tall is the Taipei 101 skyscraper?",508,"n","meters"],
["How tall is the Matterhorn?",4478,"n","meters"],["How tall is the Christ the Redeemer statue in Rio, not counting its pedestal?",30,"n","meters"]],
"Space":[
["How wide is the Earth (its diameter)?",12742,"n","km"],["How far away is the Moon, on average?",384400,"n","km"],["How far is the Earth from the Sun, on average?",149600000,"n","km"],
["How fast does light travel?",299792,"n","km per second"],["How many Earth days long is a year on Mars?",687,"n","days"],["How old is the universe?",13.8,"n","billion years"],
["How old is the Earth?",4.54,"n","billion years"],["How hot is the surface of the Sun?",5500,"n","°C"],["How wide is the Moon (its diameter)?",3474,"n","km"],
["About how many Earths could fit inside the Sun?",1300000,"n","Earths"],["How many Earth days long is a year on Mercury?",88,"n","days"],
["How many seconds does sunlight take to reach Earth?",499,"n","seconds"],["How many hours long is a day on Saturn?",10.6,"n","hours"]],
"Animals":[
["How fast can a cheetah run at top speed?",110,"n","km/h"],["How tall is an adult giraffe, roughly?",5.5,"n","meters"],["How many days is an African elephant pregnant?",660,"n","days"],
["How long can a blue whale grow?",30,"n","meters"],["How many hearts does an octopus have?",3,"n","hearts"],["About how many teeth does a great white shark have at once?",300,"n","teeth"],
["How fast can a peregrine falcon dive?",320,"n","km/h"],["How many legs does a lobster have?",10,"n","legs"],["About how much does a blue whale's heart weigh?",180,"n","kg"],
["How many hours a day does a koala sleep, roughly?",20,"n","hours"],["About how many eyes can a scallop have?",200,"n","eyes"],["How long is a giraffe's tongue, roughly?",50,"n","cm"],
["How fast can a hummingbird's heart beat, at most?",1200,"n","beats per minute"]],
"Human Body":[
["How many bones are in an adult human body?",206,"n","bones"],["How many teeth does an adult usually have, wisdom teeth included?",32,"n","teeth"],
["How many liters of blood are in an adult human body?",5,"n","liters"],["How many times does a human heart beat in a day, roughly?",100000,"n","beats"],
["About how many bones is a newborn baby born with?",300,"n","bones"],["About how many taste buds does an adult have?",10000,"n","taste buds"],
["About how long is the small intestine?",6,"n","meters"],["About how many muscles are in the human body?",600,"n","muscles"],["About how many hairs are on a human head?",100000,"n","hairs"],
["What is normal body temperature in Fahrenheit?",98.6,"n","°F"],["Laid end to end, about how long would all your blood vessels be?",100000,"n","km"],
["About how many times does a person blink in a day?",15000,"n","blinks"]],
"Inventions":[
["In what year did Alexander Graham Bell patent the telephone?",1876,"y"],["In what year did the Wright brothers make their first powered flight?",1903,"y"],
["In what year did the first iPhone come out?",2007,"y"],["In what year was Google founded?",1998,"y"],["In what year did Wikipedia launch?",2001,"y"],
["In what year was YouTube founded?",2005,"y"],["In what year was Coca-Cola invented?",1886,"y"],["In what year did Alexander Fleming discover penicillin?",1928,"y"],
["In what year did Tim Berners-Lee propose the World Wide Web?",1989,"y"],["In what year was the LEGO brick as we know it patented?",1958,"y"],
["Around what year did Gutenberg build his printing press?",1440,"y"],["In what year was the first email sent?",1971,"y"],["In what year did John Logie Baird first demonstrate television?",1926,"y"]],
"History":[
["In what year did the Berlin Wall fall?",1989,"y"],["In what year did the Titanic sink?",1912,"y"],["In what year did Columbus first reach the Americas?",1492,"y"],
["In what year was the Magna Carta sealed?",1215,"y"],["In what year was the US Declaration of Independence signed?",1776,"y"],["In what year was the Great Fire of London?",1666,"y"],
["In what year did the French Revolution begin?",1789,"y"],["In what year was the Battle of Hastings?",1066,"y"],["In what year did Mount Vesuvius bury Pompeii?",79,"y"],
["In what year did World War I begin?",1914,"y"],["In what year did World War II end?",1945,"y"],["In what year did the Western Roman Empire fall?",476,"y"],
["In what year did Nelson Mandela become president of South Africa?",1994,"y"],["In what year was the Chernobyl disaster?",1986,"y"]],
"Movies & Music":[
["In what year did the Beatles release their first album?",1963,"y"],["In what year did the first Star Wars film come out?",1977,"y"],["In what year did Toy Story come out?",1995,"y"],
["In what year did the movie Titanic come out?",1997,"y"],["In what year did Elvis release 'Heartbreak Hotel'?",1956,"y"],["In what year did Michael Jackson's 'Thriller' album come out?",1982,"y"],
["In what year did 'The Wizard of Oz' film come out?",1939,"y"],["In what year did MTV first go on the air?",1981,"y"],["In what year did Disney's 'Snow White' come out?",1937,"y"],
["In what year did 'Jaws' come out?",1975,"y"],["In what year was the Woodstock festival?",1969,"y"],["In what year did Disney's animated 'The Lion King' come out?",1994,"y"]],
"Sports":[
["How long is a marathon?",42.195,"n","km"],["How high is a basketball hoop?",10,"n","feet"],["What is the 100 m sprint world record?",9.58,"n","seconds"],
["How long is a tennis court?",78,"n","feet"],["How many players does a rugby union team have on the field?",15,"n","players"],["What is the highest possible break in snooker?",147,"n","points"],
["What is the highest score with three darts?",180,"n","points"],["What is a perfect score in ten-pin bowling?",300,"n","points"],["How long is an Olympic swimming pool?",50,"n","meters"],
["About how long is the Tour de France, in total?",3500,"n","km"],["How tall is a men's volleyball net?",2.43,"n","meters"],["How heavy is a men's Olympic shot put?",7.26,"n","kg"],
["In what year were the first modern Olympic Games held?",1896,"y"]],
"Food & Drink":[
["How many calories are in one gram of fat?",9,"n","calories"],["How many calories are in one gram of carbohydrate?",4,"n","calories"],
["About how many kernels are on an ear of corn?",800,"n","kernels"],["About how many seeds are on the outside of a strawberry?",200,"n","seeds"],
["About how many Scoville heat units does a Carolina Reaper pepper average?",1600000,"n","SHU"],["About how many grapes go into one bottle of wine?",700,"n","grapes"],
["What percentage of a cucumber is water?",96,"n","%"],["About how many gallons of maple sap make one gallon of syrup?",40,"n","gallons"],
["About how many pounds of milk does it take to make one pound of cheese?",10,"n","pounds"],["About how many teaspoons of sugar are in a 12 oz can of Coca-Cola?",10,"n","teaspoons"],
["About how many apple varieties are grown around the world?",7500,"n","varieties"]],
"Rivers & Islands":[
["How long is the Nile River?",6650,"n","km"],["How long is the Amazon River?",6400,"n","km"],["How deep is Lake Baikal, the world's deepest lake?",1642,"n","meters"],
["About how many islands make up Indonesia?",17000,"n","islands"],["How tall is Angel Falls, the world's highest waterfall?",979,"n","meters"],["How long is the Great Barrier Reef?",2300,"n","km"],
["How long is the Mississippi River on its own?",3730,"n","km"],["How deep is the deepest point of the ocean (Challenger Deep)?",10935,"n","meters"],
["How big is the Caspian Sea?",371000,"n","square km"],["How big is Greenland?",2166000,"n","square km"],["How big is Lake Superior?",82100,"n","square km"],
["About how many islands make up the Philippines?",7641,"n","islands"],["How big is the Pacific Ocean?",165000000,"n","square km"]],
"Everyday Numbers":[
["How many seconds are in a day?",86400,"n","seconds"],["How many hours are in a (non-leap) year?",8760,"n","hours"],["How many keys are on a standard piano?",88,"n","keys"],
["How many squares are on a chessboard's grid?",64,"n","squares"],["About how many words are in 'War and Peace'?",587000,"n","words"],["How many first moves can White choose from in chess?",20,"n","moves"],
["How many minutes are in a week?",10080,"n","minutes"],["How many sheets of paper are in a ream?",500,"n","sheets"],["How many dots are on a pair of standard dice?",42,"n","dots"],
["How many letters are in 'pneumonoultramicroscopicsilicovolcanoconiosis'?",45,"n","letters"],["About how many languages are spoken in the world today?",7000,"n","languages"]],
"Landmarks":[
["In what year was the Eiffel Tower finished?",1889,"y"],["In what year was the Statue of Liberty dedicated?",1886,"y"],["In what year did the Golden Gate Bridge open?",1937,"y"],
["In what year did the Sydney Opera House open?",1973,"y"],["In what year did the Panama Canal open?",1914,"y"],["In what year did Disneyland open?",1955,"y"],
["How many steps go up to the top of the Eiffel Tower?",1665,"n","steps"],["How much does the Eiffel Tower weigh, in total?",10100,"n","tonnes"],
["How many spectators could the Roman Colosseum hold?",50000,"n","people"],["How long is the Great Wall of China, counting all its sections?",21196,"n","km"],
["How long is the main span of the Golden Gate Bridge?",1280,"n","meters"],["How long is the Channel Tunnel between England and France?",50,"n","km"],
["About how many days did it take to build the Empire State Building?",410,"n","days"]],
"Science":[
["How fast does sound travel through air at sea level?",343,"n","meters per second"],["How many elements are on the periodic table?",118,"n","elements"],
["At what temperature does water boil at sea level, in Fahrenheit?",212,"n","°F"],["How many degrees below zero Celsius is absolute zero?",273,"n","degrees"],
["How many chromosomes are in most human cells?",46,"n","chromosomes"],["About how many times denser than water is gold?",19.3,"n","times"],
["How fast do things fall at Earth's surface, in meters per second squared?",9.8,"n","m/s²"],["About how long is one light-year?",9460000000000,"n","km"],
["At what temperature does iron melt?",1538,"n","°C"],["What percentage of the air is nitrogen?",78,"n","%"],
["How fast does light travel, in km per hour?",1080000000,"n","km/h"]],
"Books & Art":[
["Around what year did Leonardo da Vinci start painting the Mona Lisa?",1503,"y"],["In what year was the first Harry Potter book published?",1997,"y"],
["In what year was William Shakespeare born?",1564,"y"],["In what year was 'Pride and Prejudice' published?",1813,"y"],["In what year was 'Frankenstein' published?",1818,"y"],
["In what year was 'Moby-Dick' published?",1851,"y"],["In what year did Michelangelo finish the Sistine Chapel ceiling?",1512,"y"],
["In what year did Van Gogh paint 'The Starry Night'?",1889,"y"],["In what year was the first part of 'Don Quixote' published?",1605,"y"],
["In what year was 'The Hobbit' published?",1937,"y"],["In what year was 'A Christmas Carol' published?",1843,"y"],["How many sonnets did Shakespeare write?",154,"n","sonnets"]],
"World Records":[
["How tall was Robert Wadlow, the tallest man on record?",272,"n","cm"],["How old was Jeanne Calment, the oldest person on record?",122,"n","years"],
["What is the hottest air temperature ever recorded on Earth?",56.7,"n","°C"],["How many degrees below zero °C is the coldest temperature ever recorded on Earth?",89,"n","degrees"],
["How tall is Hyperion, the tallest known tree?",116,"n","meters"],["What is the land speed record, set by ThrustSSC in 1997?",1228,"n","km/h"],
["From about how high did Felix Baumgartner skydive in 2012?",39,"n","km"],["How many seconds long is the longest recorded chicken flight?",13,"n","seconds"],
["For how much did 'Salvator Mundi', the priciest painting ever sold, go in 2017?",450000000,"n","US dollars"],
["For how many years did Charles Osborne, who holds the record, have hiccups?",68,"n","years"],["How many hot dogs did Joey Chestnut eat to win Nathan's contest in 2021?",76,"n","hot dogs"],
["How tall was Zeus, the tallest dog on record, at the shoulder?",112,"n","cm"]],
"Space Missions":[
["In what year was Sputnik, the first satellite, launched?",1957,"y"],["In what year did people first walk on the Moon?",1969,"y"],["In what year was the Hubble Space Telescope launched?",1990,"y"],
["In what year did the first crew move into the International Space Station?",2000,"y"],["In what year did Yuri Gagarin become the first person in space?",1961,"y"],
["In what year was Voyager 1 launched?",1977,"y"],["In what year did the first Mars rover, Sojourner, land?",1997,"y"],["In what year did New Horizons fly past Pluto?",2015,"y"],
["In what year did Valentina Tereshkova become the first woman in space?",1963,"y"],["In what year did the last Apollo astronauts walk on the Moon?",1972,"y"],
["In what year was the James Webb Space Telescope launched?",2021,"y"]]
};
// the four built from data, then the hand-written ones
const GEN_CATS={Population:"pop",Area:"area","US Presidents":"pres",Elements:"elem"};
const ALL_CATS=Object.keys(GEN_CATS).concat(Object.keys(CATS));
const QN=7;
const CSS=`
.cw-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;max-width:560px;margin:0 auto}
.cw-head{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.cw-head div{background:var(--hi);box-shadow:var(--sunken);padding:3px 10px;text-align:center;min-width:72px}
.cw-head small{display:block;font-size:11px;color:#404040}.cw-head b{font-size:17px;font-variant-numeric:tabular-nums}
.cw-q{font-weight:700;font-size:18px;text-align:center;line-height:1.3}
.cw-cat{font-size:12px;color:#404040;text-align:center;text-transform:uppercase;letter-spacing:.05em}
.cw-in{display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center}
.cw-in input{font:inherit;font-size:20px;width:11em;max-width:60vw;padding:4px 6px;text-align:right;box-shadow:var(--sunken);border:0;background:#fff;font-variant-numeric:tabular-nums}
.cw-unit{font-weight:700}
.cw-mul{display:flex;gap:4px;justify-content:center;flex-wrap:wrap}
.cw-mul .btn[aria-pressed="true"]{box-shadow:var(--sunken);background:var(--hi);font-weight:700}
.cw-prev{font-size:13px;color:#404040;min-height:1.3em;text-align:center}
.cw-res{text-align:center;line-height:1.5;min-height:1.5em}
.cw-big{font-size:28px;font-weight:700}
.cw-line{position:relative;width:min(100%,480px);height:44px;margin:4px auto 14px}
.cw-line::before{content:"";position:absolute;left:0;right:0;top:21px;border-top:2px solid #000}
.cw-mk{position:absolute;top:0;transform:translateX(-50%);font-size:11px;font-weight:700;white-space:nowrap;text-align:center}
.cw-mk i{display:block;width:12px;height:12px;border-radius:50%;margin:3px auto 0;border:2px solid #fff;box-shadow:0 0 0 1px #000}
.cw-mk.you i{background:#e00000}.cw-mk.ans i{background:#00a000}.cw-mk.you{top:22px}.cw-mk.you i{margin:0 auto 1px}
.cw-sum{width:min(100%,480px);border-collapse:collapse;font-size:13px}
.cw-sum td{padding:3px 4px;border-bottom:1px solid #a0a0a0;vertical-align:top}.cw-sum td:last-child{text-align:right;font-weight:700;white-space:nowrap}`;
// "1,200", "1.2k", "3.5 million", "8bn" -> number (NaN if it doesn't parse)
function parse(t){t=String(t).toLowerCase().replace(/[,\s_]/g,"").replace(/^~/,"");const m=t.match(/^(-?\d*\.?\d+)(k|thousand|m|mil|mill|million|b|bn|bil|billion|t|trillion)?$/);if(!m)return NaN;
  const mul={k:1e3,thousand:1e3,m:1e6,mil:1e6,mill:1e6,million:1e6,b:1e9,bn:1e9,bil:1e9,billion:1e9,t:1e12,trillion:1e12}[m[2]]||1;return parseFloat(m[1])*mul}
function score(q,g){if(!isFinite(g))return 0;if(q.k==="y")return Math.max(0,Math.round(100-2*Math.abs(g-q.a)));if(q.k==="z")return Math.max(0,Math.round(100-100*Math.abs(g-q.a)/40));
  if(g<=0)return 0;return Math.max(0,Math.round(100*(1-Math.abs(Math.log(g/q.a))/Math.log(4))))}
function fmt(v,q){if(q&&q.k!=="n")return String(Math.round(v));const a=Math.abs(v);if(a>=1e9)return +(v/1e9).toPrecision(3)+" billion";if(a>=1e7)return +(v/1e6).toPrecision(3)+" million";return v.toLocaleString("en-US",{maximumFractionDigits:a<10?2:a<100?1:0})}
// questions built from the app's own data, so the bank never runs dry
function gen(api,kind,rnd){return genFrom(api,kind,a=>a[Math.floor(rnd()*a.length)])}
function genFrom(api,kind,pick){
  if(kind==="pop"){const c=pick(api.countries().filter(c=>c.p>=1e6));return {q:`How many people live in ${c.n}? ${c.f||""}`,a:c.p,k:"n",u:"people",cat:"Population"}}
  if(kind==="area"){const c=pick(api.countries().filter(c=>c.area>=2e4));return {q:`How big is ${c.n}? ${c.f||""}`,a:c.area,k:"n",u:"square km",cat:"Area"}}
  if(kind==="pres"){const seen=new Set(),p=pick(api.presidents().filter(p=>/^\d{4}/.test(p[2])&&!seen.has(p[1])&&seen.add(p[1])));return {q:`In what year did ${p[1]} first take office as US president?`,a:+p[2].slice(0,4),k:"y",cat:"US presidents"}}
  const e=pick(api.elements().filter(e=>e.z<=100));return {q:`What is the atomic number of ${e.n} (${e.s})?`,a:e.z,k:"z",u:"",cat:"Elements"}}
function build(api,rnd){const kinds=api.shuffle(["pop","area","pres","elem"],rnd).slice(0,3),years=BANK.filter(b=>b[2]==="y"),nums=BANK.filter(b=>b[2]==="n");
  const bank=api.shuffle(nums,rnd).slice(0,3).concat(api.shuffle(years,rnd).slice(0,1)).map(b=>({q:b[0],a:b[1],k:b[2],u:b[3]||"",cat:b[2]==="y"?"History":"Numbers"}));
  return api.shuffle(kinds.map(k=>gen(api,k,rnd)).concat(bank),rnd)}
// a question set is a key: "d<date>" (that day's Daily) or "p<seed>" (a practice deal); friends play the same set from a link
// From this date, Dailies (and "q" practice deals) use the category rotation; earlier Dailies and old "p" practice links keep their questions.
const CW2_FROM="2026-10-30";
const isV2=key=>key[0]==="q"||(key[0]==="d"&&key.slice(1)>=CW2_FROM);
// seven different categories a game. A Daily walks a fixed order of all 20, so a category is never back the next day,
// and each category steps through its own shuffled list, so a question doesn't repeat for over a month.
function build2(api,key){
  const ask=(name,choose)=>GEN_CATS[name]?Object.assign(genFrom(api,GEN_CATS[name],choose),{cat:name}):(b=>({q:b[0],a:b[1],k:b[2],u:b[3]||"",cat:name}))(choose(CATS[name]));
  if(key[0]==="d"){const date=key.slice(1),n=api.dayNum(date),order=api.shuffle(ALL_CATS,api.rng("cw-cats")),C=order.length,qs=[];
    for(let k=0;k<QN;k++){const slot=n*QN+k,name=order[((slot%C)+C)%C],lap=Math.floor(slot/C);
      qs.push(ask(name,list=>{const p=api.shuffle(list,api.rng("cw-q|"+name));return p[((lap%p.length)+p.length)%p.length]}))}
    return api.shuffle(qs,api.rng("closest|"+date))}
  const rnd=api.rng("closest-q|"+key.slice(1));return api.shuffle(ALL_CATS,rnd).slice(0,QN).map(name=>ask(name,list=>list[Math.floor(rnd()*list.length)]))}
const rngFor=(api,key)=>api.rng(key[0]==="d"?"closest|"+key.slice(1):"closest-p|"+key.slice(1));
const totalOf=(qs,g)=>qs.reduce((a,q,i)=>a+(g[i]!=null?score(q,g[i]):0),0);
const emo=p=>p>=90?"🎯":p>=70?"🟢":p>=40?"🟡":p>0?"🟠":"🔴";
A95G.closest={
help:`<div>Seven questions with a number for an answer: heights, distances, populations, years. Nobody expects you to know them exactly. Just get <b>close</b>.</div>
<ul class="factlist"><li>Exactly right is 100 points. Off by half or double is 50. Off by 4 times or more is 0.</li><li>Years lose 2 points for every year you're off.</li>
<li>Type big numbers however you like: <b>2,500,000</b>, <b>2.5m</b> or <b>2.5 million</b> all work. Or tap <b>thousand</b>, <b>million</b> or <b>billion</b>.</li><li>The <b>Daily</b> game is the same for everyone today. <b>Practice</b> deals new questions every time.</li>
<li><b>Challenge a friend:</b> after a game, send the link. Your friend plays the same seven questions, sees your answer after each one, and can send theirs back so you see how they did, question by question.</li></ul>`,
mount(api){
  api.css(CSS+`
.cw-vs{font-size:13px;color:#000080;font-weight:700;text-align:center}
.cw-sum th{font-size:11px;text-align:right;padding:2px 4px;border-bottom:2px solid #000}.cw-sum th:first-child{text-align:left}
.cw-sum td.cw-p{text-align:right;font-weight:700;white-space:nowrap}.cw-sum td.win{background:#c8f0c8}
.cw-fr{display:flex;gap:4px;flex-wrap:wrap;justify-content:center}
.cw-fr .btn[aria-pressed="true"]{box-shadow:var(--sunken);background:var(--hi);font-weight:700}
.cw-name{display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap}
.cw-name input{font:inherit;padding:3px 6px;box-shadow:var(--sunken);border:0;background:#fff;width:11em}`);
  const st=api.stats;st.days=st.days||{};st.sets=st.sets||{};st.vs=st.vs||{};const link=api.linkData(),mo=link?null:api.modeOpts();if(mo)st.mode="practice";st.mode=st.mode==="practice"?"practice":"daily";
  const today=api.today();let G,mul=1,fi=0;
  api.bar.innerHTML=`<select class="sel95" data-cwmode aria-label="Mode"><option value="daily"${st.mode==="daily"?" selected":""}>Daily</option><option value="practice"${st.mode==="practice"?" selected":""}>Practice</option></select><button class="btn" type="button" data-cw="new">New game</button>`;
  api.root.innerHTML=`<div class="cw-wrap"><div class="cw-head"></div><div class="cw-main"></div></div>`;
  const main=api.root.querySelector(".cw-main");
  const mine=key=>st.sets[key]||(key[0]==="d"&&st.days[key.slice(1)]&&st.days[key.slice(1)].g?{g:st.days[key.slice(1)].g}:null);
  const friends=key=>st.vs[key]||[];
  function fresh(){api.bar.querySelector('[data-cw="new"]').hidden=st.mode==="daily";
    // a vault challenge or tournament run deals from the vault's seed; otherwise the set key does
    if(mo){G={key:null,qs:build(api,api.begin({})),vault:true};begin();return}
    play(st.mode==="daily"?"d"+today:"q"+Math.floor(Math.random()*4294967296).toString(36),null)}
  function play(key,vs){G={key,qs:isV2(key)?build2(api,key):build(api,rngFor(api,key)),vs,daily:key==="d"+today};fi=0;begin()}
  function begin(){Object.assign(G,{i:0,g:[],pts:[],done:false});const m=G.key&&mine(G.key);
    if(m){G.g=m.g.slice();G.pts=G.qs.map((q,i)=>score(q,G.g[i]));G.i=QN;G.done=true;over();return}ask()}
  function tot(){return G.pts.reduce((a,b)=>a+b,0)}
  function label(){return G.vault?"Challenge":G.daily?`Daily · ${api.niceDate(today)}`:G.key[0]==="d"?`Daily · ${api.niceDate(G.key.slice(1))}`:"Practice"}
  function head(){api.root.querySelector(".cw-head").innerHTML=`<div><small>QUESTION</small><b>${Math.min(G.i+1,QN)}/${QN}</b></div><div><small>SCORE</small><b>${tot()}</b></div>${G.vs&&!G.done?`<div><small>${api.esc(G.vs.n.toUpperCase())}</small><b>${totalOf(G.qs.slice(0,G.i),G.vs.g)}</b></div>`:""}`;
    api.status(label(),st.best!=null?`Best: ${st.best} / ${QN*100}`:"")}
  function ask(){const q=G.qs[G.i],big=q.k==="n"&&q.a>=2e4;mul=1;head();
    main.innerHTML=`${G.vs&&G.i===0?`<div class="cw-vs">🏁 ${api.esc(G.vs.n)} scored ${totalOf(G.qs,G.vs.g)} on these questions. Can you get closer?</div>`:""}<div class="cw-cat">${api.esc(q.cat)}</div><div class="cw-q">${api.esc(q.q)}</div>
      <form class="cw-in" data-cwf><input id="cwg" type="text" inputmode="${big?"text":"decimal"}" autocomplete="off" enterkeyhint="done" aria-label="Your guess" placeholder="${q.k==="y"?"Year":"Your guess"}"><span class="cw-unit">${api.esc(q.u||"")}</span><button class="btn default" type="submit">Guess</button></form>
      ${big?`<div class="cw-mul" role="group" aria-label="Multiply by">${[[1e3,"thousand"],[1e6,"million"],[1e9,"billion"]].map(([v,l])=>`<button class="btn" type="button" data-cwm="${v}" aria-pressed="false">${l}</button>`).join("")}</div>`:""}
      <div class="cw-prev" aria-live="polite"></div>`;
    const inp=main.querySelector("#cwg");if(matchMedia("(pointer:fine)").matches)inp.focus({preventScroll:true})}
  function val(){const inp=main.querySelector("#cwg");if(!inp)return NaN;const v=parse(inp.value);return isFinite(v)?v*mul:NaN}
  function preview(){const p=main.querySelector(".cw-prev");if(!p)return;const v=val(),q=G.qs[G.i];p.textContent=isFinite(v)&&(mul!==1||/[a-z]/i.test(main.querySelector("#cwg").value))?`= ${fmt(v)} ${q.u||""}`:""}
  function line(q,g){if(!isFinite(g)||(q.k==="n"&&g<=0))return "";let lo,hi,f;
    if(q.k==="n"){const a=Math.log(Math.min(g,q.a)),b=Math.log(Math.max(g,q.a)),pad=Math.max(.25,(Math.log(4)-(b-a))/2);lo=a-pad;hi=b+pad;f=v=>(Math.log(v)-lo)/(hi-lo)}
    else{const span=Math.max(q.k==="y"?60:20,Math.abs(g-q.a)*1.4),mid=(g+q.a)/2;lo=mid-span/2;hi=mid+span/2;f=v=>(v-lo)/(hi-lo)}
    const pc=v=>Math.max(4,Math.min(96,f(v)*100)).toFixed(1)+"%";
    return `<div class="cw-line" aria-hidden="true"><div class="cw-mk ans" style="left:${pc(q.a)}">Answer<i></i></div><div class="cw-mk you" style="left:${pc(g)}"><i></i>You</div></div>`}
  function off(q,g){if(!isFinite(g))return "No guess";if(g===q.a)return "Exactly right!";
    if(q.k!=="n"){const d=Math.abs(g-q.a);return `${d.toLocaleString("en-US")} ${q.k==="y"?(d===1?"year":"years"):""} too ${g<q.a?(q.k==="y"?"early":"low"):(q.k==="y"?"late":"high")}`.replace("  "," ")}
    if(g<=0)return "Too low";const r=Math.max(g,q.a)/Math.min(g,q.a);return r<1.1?`Within ${Math.max(1,Math.round((r-1)*100))}%`:`${r<10?r.toFixed(1):Math.round(r).toLocaleString("en-US")}× too ${g<q.a?"low":"high"}`}
  function guess(){const g=val(),q=G.qs[G.i];if(!isFinite(g)){const p=main.querySelector(".cw-prev");if(p)p.textContent="Type a number first.";return}
    const pts=score(q,g),i=G.i;G.g.push(g);G.pts.push(pts);G.i++;head();if(pts===100)st.bulls=(st.bulls||0)+1;api.sound(pts>=90?"win":pts>=50?"ding":pts>0?"tap":"lose");
    const fg=G.vs&&G.vs.g[i],fp=fg!=null?score(q,fg):null;
    main.innerHTML=`<div class="cw-cat">${api.esc(q.cat)}</div><div class="cw-q">${api.esc(q.q)}</div>
      <div class="cw-res"><div class="cw-big">${fmt(q.a,q)} ${api.esc(q.u||"")}</div>You said ${fmt(g,q)}. ${off(q,g)} &middot; <b>+${pts}</b></div>${line(q,g)}
      ${fp!=null?`<div class="cw-vs">${api.esc(G.vs.n)} said ${fmt(fg,q)} &middot; +${fp} ${fp>pts?"(they win this one)":fp<pts?"(you win this one)":"(tie)"}</div>`:""}
      <div class="cw-in"><button class="btn default" type="button" data-cw="next">${G.i<QN?"Next question &gt;":"See my score &gt;"}</button></div>`;
    const nb=main.querySelector('[data-cw="next"]');if(matchMedia("(pointer:fine)").matches)nb.focus({preventScroll:true})}
  function finish(){const t=tot(),prev=st.best,nb=prev==null||t>prev;if(nb)st.best=t;st.games=(st.games||0)+1;G.done=true;
    if(G.key){st.sets[G.key]={g:G.g,t:today};const ks=Object.keys(st.sets);if(ks.length>40)ks.slice(0,ks.length-40).forEach(k=>delete st.sets[k])}
    if(G.daily&&!st.days[today])st.days[today]={s:t,g:G.g,pts:G.pts};
    const r=api.result(G.daily?{xp:Math.round(t/50)+5}:{xp:Math.round(t/70),ch:G.vault?{v:t,text:`${t} points`,higher:true}:null});
    if(nb&&prev!=null)api.toast(`<span class="gmtemo">🏆</span><span><b>New best in Closest Wins!</b><br>${t} / ${QN*100} points</span>`);api.sound("win");over(r)}
  // the results table; with friends on the same set, their answers sit next to yours
  function over(r){head();const t=tot(),fr=G.key?friends(G.key):[],f=fr[Math.min(fi,fr.length-1)]||null,ft=f?totalOf(G.qs,f.g):0;
    fr.forEach(x=>{const xt=totalOf(G.qs,x.g),daily=G.key[0]==="d";api.log(Object.assign({k:`closest|${G.key}|${x.n.toLowerCase()}`,n:x.n,what:daily?"Daily":"Practice",me:`${t}/${QN*100}`,them:`${xt}/${QN*100}`,res:t>xt?"w":t<xt?"l":"t",view:{data:{k:G.key,n:x.n,g:x.g}}},daily?{d:G.key.slice(1)}:{}))});
    const verdict=f?(t>ft?`You beat ${api.esc(f.n)}! 🏆`:t<ft?`${api.esc(f.n)} wins this one.`:`It's a tie with ${api.esc(f.n)}!`):"";
    main.innerHTML=`<div class="cw-res"><div class="cw-big">${t}${f?` <span style="font-size:20px">vs</span> ${ft}`:""} <span style="font-size:16px">/ ${QN*100}</span></div>${verdict?`<b>${verdict}</b><br>`:""}${r&&r.xp?`+${r.xp} XP`:""}</div>
      ${fr.length>1?`<div class="cw-fr" role="group" aria-label="Compare with">${fr.map((x,i)=>`<button class="btn" type="button" data-cwfr="${i}" aria-pressed="${x===f}">${api.esc(x.n)} ${totalOf(G.qs,x.g)}</button>`).join("")}</div>`:""}
      <table class="cw-sum"><tr><th>Question</th><th>You</th>${f?`<th>${api.esc(f.n)}</th>`:""}</tr>${G.qs.map((q,i)=>{const mp=G.pts[i],fp=f&&f.g[i]!=null?score(q,f.g[i]):null;
        return `<tr><td>${api.esc(q.q)}<br><span class="note">Answer ${fmt(q.a,q)} ${api.esc(q.u||"")} &middot; you ${G.g[i]!=null?fmt(G.g[i],q):"-"}${f?` &middot; ${api.esc(f.n)} ${f.g[i]!=null?fmt(f.g[i],q):"-"}`:""}</span></td><td class="cw-p${f&&mp>fp?" win":""}">${mp!=null?mp:"-"}</td>${f?`<td class="cw-p${fp>mp?" win":""}">${fp!=null?fp:"-"}</td>`:""}</tr>`}).join("")}</table>
      ${G.key&&!api.nick()?`<div class="cw-name"><label for="cwnm">Your name:</label><input id="cwnm" maxlength="24" autocomplete="nickname" placeholder="So friends know it's you"></div>`:""}
      <div class="cw-in">${G.key?`<button class="btn default" type="button" data-cw="send">${f?`Send my answers to ${api.esc(f.n)}...`:"Challenge a friend..."}</button>`:""}${!G.daily&&!G.vault?`<button class="btn" type="button" data-cw="new">New questions</button>`:""}</div>
      <div class="cw-prev" aria-live="polite">${G.daily?"New questions tomorrow.":""}</div>`;if(G.key)cwLink()}
  // links are made ahead of the tap (saving a short link takes a moment, and phones only allow sharing straight after a tap)
  let prep=null;
  function cwLink(){const ni=main.querySelector("#cwnm"),name=(ni&&ni.value.trim())||api.nick()||"A friend",key=`${G.key}|${name}`;
    if(!prep||prep.key!==key)prep={key,p:api.shareLink({k:G.key,n:name,g:G.g.map(v=>+(+v).toPrecision(6))},name)};return prep.p}
  async function send(btn){const ni=main.querySelector("#cwnm");if(ni&&ni.value.trim())api.nick(ni.value.trim());const t=tot(),fr=friends(G.key),f=fr[Math.min(fi,fr.length-1)];
    const url=await cwLink();
    const text=`🎯 Closest Wins on Atlas95${G.key[0]==="d"?` · ${api.niceDate(G.key.slice(1))}`:""}\n${f?`I got ${t} vs your ${totalOf(G.qs,f.g)}!`:`I scored ${t}/${QN*100}. Can you get closer? 🎯`}\n${G.pts.map(emo).join("")}`;
    const msg=main.querySelector(".cw-prev");
    if(navigator.share&&matchMedia("(pointer:coarse)").matches){try{await navigator.share({text:`${text}\n${url}`});if(msg)msg.textContent="Sent!";return}catch(e){if(e&&e.name==="AbortError")return}}
    api.share(`${text}\n${url}`,btn);if(msg)msg.textContent="Link copied. Paste it to a friend!"}
  // a friend's link: keep their answers, then compare if this set is already played, or play it with theirs alongside
  function open(o){const g=(o.g||[]).slice(0,QN).map(Number),name=String(o.n||"A friend").slice(0,24),key=String(o.k);
    const m=mine(key),own=m&&name===api.nick()&&g.join()===m.g.slice(0,g.length).join();
    if(!own){const list=st.vs[key]=st.vs[key]||[],j=list.findIndex(x=>x.n===name),x={n:name,g};if(j>=0)list[j]=x;else list.push(x);
      const ks=Object.keys(st.vs);if(ks.length>40)ks.slice(0,ks.length-40).forEach(k=>delete st.vs[k]);api.save()}
    const vs=own?null:{n:name,g};play(key,vs);fi=Math.max(0,friends(key).findIndex(x=>x.n===name))}
  const onClick=e=>{const m=e.target.closest("[data-cwm]");if(m){const v=+m.dataset.cwm,on=mul!==v;mul=on?v:1;main.querySelectorAll("[data-cwm]").forEach(b=>b.setAttribute("aria-pressed",String(on&&+b.dataset.cwm===v)));preview();return}
    const fb=e.target.closest("[data-cwfr]");if(fb){fi=+fb.dataset.cwfr;over();return}
    const b=e.target.closest("[data-cw]");if(!b)return;const k=b.dataset.cw;
    if(k==="next"){if(G.i<QN)ask();else finish()}else if(k==="new"){if(st.mode!=="daily"||!G.daily){st.mode="practice";api.bar.querySelector("[data-cwmode]").value="practice";fresh()}}else if(k==="send")send(b)};
  api.on(api.root,"click",onClick);api.on(api.bar,"click",onClick);
  api.on(api.root,"submit",e=>{if(e.target.matches("[data-cwf]")){e.preventDefault();guess()}});
  api.on(api.root,"input",e=>{if(e.target.id==="cwg")preview()});
  api.on(api.root,"change",e=>{if(e.target.id==="cwnm"&&G.key)cwLink()});
  api.on(api.bar,"change",e=>{if(e.target.matches("[data-cwmode]")){st.mode=e.target.value;api.save();fresh()}});
  if(link&&typeof link==="object"&&/^[dpq][\w-]{1,20}$/.test(String(link.k))&&Array.isArray(link.g)){api.bar.querySelector('[data-cw="new"]').hidden=true;open(link)}
  else{if(link)api.toast("That Closest Wins link didn't work. Ask your friend to send it again.");fresh()}
  return {unmount(){}};
}};
A95G.closest._t={parse,score,BANK};
})();
