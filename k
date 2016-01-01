#!/bin/bash

IP=192.168.1.113

number=`curl "http://$IP/numOfRooms" -H "Origin: http://$IP" -H "Accept-Encoding: gzip, deflate" -H "Accept-Language: en-US,en;q=0.8,sk;q=0.6" -H "User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36" -H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" -H "Accept: text/plain, */*; q=0.01" -H "Referer: http://$IP/menu.html" -H "X-Requested-With: XMLHttpRequest" -H "Connection: keep-alive" --data "param=+" --compressed | tail -1`
cdate=`date +"%d.%m.%Y %H:%M:%S"`
fdate=`date +"%d%m%Y"`
for i in `seq 0 $((number-1))`
do
    cline=`curl "http://$IP/wholeRoom" -H "Origin: http://$IP" -H "Accept-Encoding: gzip, deflate" -H "Accept-Language: en-US,en;q=0.8,sk;q=0.6" -H "User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36" -H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" -H "Accept: text/plain, */*; q=0.01" -H "Referer: http://$IP/h_inforoom.html" -H "X-Requested-With: XMLHttpRequest" -H "Connection: keep-alive" --data "param=$i" --compressed`
    echo "${cdate} ${cline}" >> /storage/.k/data/k_${i}_${fdate}
done

cline=`curl 'http://192.168.1.113/loadHDO' -H 'Origin: http://192.168.1.113' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8,sk;q=0.6' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/45.0.2454.101 Chrome/45.0.2454.101 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Accept: text/plain, */*; q=0.01' -H 'Cache-Control: max-age=0' -H 'X-Requested-With: XMLHttpRequest' -H 'Connection: keep-alive' -H 'Referer: http://192.168.1.113/e_hdo.html' --data 'param=+' --compressed`
echo "${cdate} ${cline}" >> /storage/.k/data/k_18_${fdate}

