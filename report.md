# Tækniskýrsla

Hér er smá lýsing á þeirri tækni sem við erum að læra um. 

## Vagrant

Vagrant er tól sem heldur utanum sýndarvélar og stillingar á þeim. Vagrant auðveldar að hafa samræmdar vélar fyrir mismunandi umhverfi. Samnýta má stillingar til að keyra upp þróunar-, prófunar- og keyrsluvél.

## VirtualBox

VirtualBox er hugbúnaður sem gerir kleyft að keyra sýndarvélar. Sýndarvél er tölva sem keyrir inni í öðru stýrikerfi. VirtualBox skaffar þessari tölvu sýndarvélbúnað sem hægt er að keyra stýrikerfi í. Þannig er hægt að keyra í raun margar tölvur á einum vélbúnaði og geta það verið mörg eintök af sama stýrikerfinu eða sitthvort.

## Grunt

Grunt er það sem kallast á ensku task runner. Þetta er tól sem er notað í þróun javascript hugbúnaðar og hefur þann tilgang að keyra verk sem þarfnast sífelldrar endurtekningar. Hægt er að setja upp mismunandi skipanir og hver þeirra getur haft mörg verkefni. S.s. test sem gæti keyrt málskipunarpróf og einingaprófanir og build sem myndi keyra test og svo að auki afrita pakka öllum skrám og afrita á réttan stað. Annað dæmi um task runner er Gulp. Gulp leysir sama vandamál og grunt en hefur þann kost að vera í flestum tilvikum mun hraðvirkara.

## node.js

node.js er keyrsluumhverfi fyrir javascript. Það er fyrst og fremst notað til að keyra javascript forrit á vefþjónum. node er single threaded og er að mestu byggður á asynchronous kóða. Algeng gagnrýni á node er Callback hell.

## npm

npm er pakkastjórnunartól fyrir node einingar. Það er notað til að halda utanum þær einingar sem þarf fyrir node.js keyrsluumhverfið. Þeir pakkar geta verið tengdir keyrslu hugbúnaðarins t.d. express og body-parser til að vinna með http staðalinn eða tengdir þróun eins og grunt fyrir keyrslu verkefna eða karma til að höndla prófanir

## bower

bower er pakkastjórnunartól fyrir javascript verkefni. Það er notað til að halda utanum forritasöfn fyrst og fremst fyrir framendaforritun í javascript.