
Avem un model pe care baza pe față detectează 7
emoții: furie, dezgust, frică, fericire, neutru, tristețe, surpriză.

După ce folosim clasificatorul în cascadă haar pentru a detecta fețele care
ne ofera coordonatele pentru unde detecteaza fetele in poza si le folosim 
ca sa facem crop la poza. Dupa ce facem crop, facem un resize la dimensiunea
care ne trebuie. Dupa ce am incarcat modelul antrenat cu cele 7 emoții, folosim metoda predict pentru a  detecta ce emoție este pe poza si ne intoarce indexul pentru poza

[]: # Language: python
[]: # Path: Readme Emotion Detector.py


