# !/bin/bash
while true
do
	jobs=$(ps aux | grep ./Server_MI)
	count=0
	for elem in $jobs
	do
		count=$(($count+1))
	done
	if [[ $count < 23 ]]
	then
		./strt.sh
	fi
done
