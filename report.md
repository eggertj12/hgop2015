# Tækniskýrsla

Hér er smá lýsing á þeirri tækni sem við erum að læra um. 

## Vagrant

Vagrant er tól sem heldur utanum sýndarvélar og stillingar á þeim. Vagrant auðveldar að hafa samræmdar vélar fyrir mismunandi umhverfi. Samnýta má stillingar til að keyra upp þróunar-, prófunar- og keyrsluvél.

Í samhengi námskeiðsins þá uppfyllir vagrant kröfuna um að hafa einsleitan vélbúnað til að keyra á og að stillingar vélbúnaðar sé hægt á einfaldan hátt að geyma í útgáfustjórnun. Það er þónokkur skörun við hlutverk docker en eins og staðan er í dag (docker keyriri illa eða ekki nema á nýlegum 64 bita linux vélum) er ópraktískt að ætla að leysa málin almennilega án tóls á við vagrant.

## VirtualBox

VirtualBox er hugbúnaður sem gerir kleyft að keyra sýndarvélar. Sýndarvél er tölva sem keyrir inni í öðru stýrikerfi. VirtualBox skaffar þessari tölvu sýndarvélbúnað sem hægt er að keyra stýrikerfi í. Þannig er hægt að keyra í raun margar tölvur á einum vélbúnaði og geta það verið mörg eintök af sama stýrikerfinu eða sitthvort.

VirtualBox hefur ekki beina tengingu við ákveðið hlutverk í ferlinu, en það eða sambærilegt tól er forsenda fyrir því að hægt sé að nota vagrant.

## Grunt

Grunt er það sem kallast á ensku task runner. Þetta er tól sem er notað í þróun javascript hugbúnaðar og hefur þann tilgang að keyra verk sem þarfnast sífelldrar endurtekningar. Hægt er að setja upp mismunandi skipanir og hver þeirra getur haft mörg verkefni. S.s. test sem gæti keyrt málskipunarpróf og einingaprófanir og build sem myndi keyra test og svo að auki afrita pakka öllum skrám og afrita á réttan stað.

Með task runner er hægt að fjarlægja mikið af handvirkum endurteknum skrefum sem fylgja því að byggja hugbúnað. Segja má að þetta hafi verið sá hluti ferilsins sem fyrst var sjálfvirknivæddur sögulega og að hafa góðan task runner sé fyrsta grunnkrafa í öllum útgáfuferlum. 

## node.js

node.js er keyrsluumhverfi fyrir javascript. Það er fyrst og fremst notað til að keyra javascript forrit á vefþjónum. node byggir á V8 javascript vélinni úr Chrome, er single threaded og er að mestu byggður á asynchronous kóða. Algeng gagnrýni á node er Callback hell.

Fyrir verkefni okkar í þessum áfanga hefur node.js, svipað og VirtualBox, ekki beint hlutverk í ferlinu að öðru leiti en því að vera grunnurinn sem npm og vefþjónustan okkar keyrir á.

## npm

npm er pakkastjórnunartól fyrir node einingar. Það er notað til að halda utanum þær einingar sem þarf fyrir node.js keyrsluumhverfið. Þeir pakkar geta verið tengdir keyrslu hugbúnaðarins t.d. express og body-parser til að vinna með http staðalinn eða tengdir þróun eins og grunt fyrir keyrslu verkefna eða karma til að höndla prófanir.

npm styður góðar venjur í útgáfu hugbúnaðar með því að bjóða upp á möguleikann að halda utanum hæði (dependencies) verkefnisins á fyrirsjáanlegan hátt sem hægt er að stýra með útgáfustjórnun. Með npm er hægt að tryggja að í hverri byggingu hugbúnaðarins sé stöðugt ástand á þeim utanaðkomandi forritasöfnum sem þörf er á.

## bower

bower er pakkastjórnunartól fyrir javascript verkefni. Það er notað til að halda utanum forritasöfn fyrst og fremst fyrir framendaforritun í javascript.

bower hefur sambærilegt hlutverk og npm í ferlinu. Það er hinsvegar sá galli á bower að ekki er hægt að framfylgja að fullu kröfunni um að hæði séu algerlega óbreytt og því munu vinsældir bower hafa dalað nokkuð undanfarið.

# Uppbygging útgáfukerfisins

Þróun og útgáfa TicTacToe fer nú fram á 3 vélum (Tæknilega séð eru þær bara 2 en önnur þeirra er samnýtt og keyrir 2 mismunandi hlutverk sem snertast mjög lítið). Þetta eru vagrant sýndarvélar (nýta VirtualBox driver) með fastar IP-tölur á local neti í hýsli.

  * Þróunarvél. Vagrant sýndarvél með CentOS stýrikerfi sem unnið er í forritun á, getur keyrt próf, build og deploy skriftur. (Aðgangur er að þessari sýndarvél frá hýsli í gegnum deilda möppu og þannig hægt að vinna þróun á „native“ ritli).
  
  * Byggingar vél. Sama Vagrant sýndarvélin og notuð er í þróun. Hún keyrir Jenkins CI og sér um að byggja verkefnið og senda það á prófunarvélina. Þó þetta sé sama vélin snertast hlutverkin nánast ekkert. Eina snertingin frá build hlutverkinu yfir í þróunarhlutverkið er að Jenkins sækir deployment og prófana skriftur yfir í þróunarmöppuna. Þetta mætti leysa á annan hátt en hefur ekki verið talið svara fyrirhöfn að sinni.
  Byggingarvélin hefur IP-tölu 192.168.50.11 og hún opnar fyrir port 8080 þar sem Jenkins er aðgengilegur. S.s. hægt að komast í Jenkins bæði á 192.168.50.11:8080 og localhost:8080
  
  * Prófunarvél. Önnur Vagrant sýndarvél, byggð á ubuntu, sem keyrir docker ílát með verkefninu.
  Möppun porta og IP-talna er eftirfarandi eins og er núna. Docker container keyrir Express verkefnið á porti 8080 og það er mappað á port 9000 í test vélinni. Test vélin er sett upp á IP tölunni 192.168.50.12. Test url er þar með http://192.168.50.12:9000 Vagrant mappar svo porti 9000 yfir á 9090 á host vélinni sem hún keyrir á.
  
Ferli útgáfu er þannig að kóða er ýtt upp á GitHub. Jenkins CI á build vél fylgist með github safninu. Þegar breyting hefur orðið þá sækir hann nýja útgáfu af kóðanum, byggir hann, keyrir einingapróf og byggir svo að lokum nýja docker mynd með verkefninu. Ef bygging hefur tekist þá keyrist sjálfkrafa útgáfa á nýbyggðu docker myndinni yfir á prófunarvélina.

# Álagsprófanir (Capacity testing)

Álagsprófunum var bætt við á degi 9. Þær keyra ákveðinn fjölda leikja til enda í jafntefli með viðtökuprófana útfærslunni. Afköst þjónustunnar komu mér á óvart, á þann hátt að þau virðast vera lakari en ég hefði giskað á. Prófanirnar sýna nokkuð stöðugt að hver leikur taki í heildina um 40 - 45ms frá byrjun til enda. Það eru 11 skipanir / fyrirspurnir sem þarf til að spila einn leik til enda sem þýðir að hver fyrirspurn tekur um 4ms að meðaltali. Þetta eru kannski tölur sem eru eðlilegar keyrandi á milli tveggja sýndarvéla á ekkert allt of öflugum vélbúnaði en ég átti samt von á að geta séð mun fleiri leiki keyrða fyrirfram. Prófunar skrefið í útgáfupípunni var sett upp til að keyra 150 leiki sem tekur um 6,5 - 7 sek og tímaviðmið sett á 8 sek.

## Samtíma keyrsla álagsprófa
Node.js keyrir á einum þræði (single threaded) en nýtir ósamstillta (asynchronous) keyrslu fyrir allar inn- / úttaksaðgerðir eins og fyrirspurnir yfir net. Álagsprófin eins og þau eru upp lögð núna keyra því samhliða, þ.e. lykkjan sem setur leikina af stað byggir upp skipanirnar fyrir einn leik og um leið og fyrsta skipunin hefur verið send á vefþjónustuna losnar þráður node.js til að halda áfram að setja næsta leik af stað.
Ekki reyndist þörf á að googla til að staðfesta þessa hegðun því hún kom berlega í ljós um leið og fyrsta tilraun var gerð til að keyra álagsprófin. Reiprennandi (Fluid) apinn fyrir viðtökuprófanirnar hafði verið skrifaður þannig að hann treysti á samstillta (synchronous) keyrslu prófa til að viðhalda stöðu rétt og þurfti að endurskrifast með gáfulegri aðferðum.