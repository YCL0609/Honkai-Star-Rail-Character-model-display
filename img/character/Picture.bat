@echo off
cd %~dp0
set /p "num=Picture future ID>"
echo -------------------------------------
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::zh
if exist zh.png (
   magick zh.png .\zh\%num%.jpg
   del zh.png
) else if exist zh.jpg (
   copy zh.jpg .\zh\%num%.jpg
   del zh.jpg
) else if exist zh.txt (
   copy zh.txt .\zh\%num%.txt
   del zh.txt
) else (
   echo zh picture not exist!
)
echo zh picture Finish.
echo -------------------------------------
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::en
if exist en.png (
   magick en.png .\en\%num%.jpg
   del en.png
) else if exist en.jpg (
   copy en.jpg .\en\%num%.jpg
   del en.jpg
) else if exist en.txt (
   copy en.txt .\en\%num%.txt
   del en.txt
) else (
   echo en picture not exist!
)
echo en picture Finish.
echo -------------------------------------
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::jp
if exist jp.png (
   magick jp.png .\jp\%num%.jpg
   del jp.png
) else if exist jp.jpg (
   copy jp.jpg .\jp\%num%.jpg
   del jp.jpg
) else if exist jp.txt (
   copy jp.txt .\jp\%num%.txt
   del jp.txt
) else (
   echo jp picture not exist!
)
echo jp picture Finish.
echo -------------------------------------
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::ko
if exist ko.png (
   magick ko.png .\ko\%num%.jpg
   del ko.png
) else if exist ko.jpg (
   copy ko.jpg .\ko\%num%.jpg
   del ko.jpg
) else if exist ko.txt (
   copy ko.txt .\ko\%num%.txt
   del ko.txt
) else (
   echo ko picture not exist!
)
echo ko picture Finish.
echo -------------------------------------
pause