function build(){
    for targetFile in assets/*
    do
        matchedFlag=0
        targetFullFilename=${targetFile##*/}
        targetFilename=${targetFullFilename%%-*}
        tempFileTargetFilename=${targetFullFilename#*-}
        targetHash=${tempFileTargetFilename%.*}
        targetFiletype=${targetFullFilename##*.}
        for sourceFile in $1/assets/*
            do
            sourceFullFilename=${sourceFile##*/} # index-50e7c4e3.js
            sourceFilename=${sourceFullFilename%%-*} # index
            tempFileSourceFilename=${sourceFullFilename#*-}
            sourceHash=${tempFileSourceFilename%.*} # 50e7c4e3
            sourceFiletype=${sourceFullFilename##*.} # js
                if [[ ${targetFilename} == ${sourceFilename} && ${sourceFiletype} == ${targetFiletype} && ${targetHash} != ${sourceHash} ]]
                then
                    matchedFlag=1
                    git mv ${targetFile} assets/${sourceFullFilename}
                    break
                fi
        done
        if [ ${matchedFlag} == 0 ] # no match file, delete it.
        then
            rm -f $targetFile
        fi
    done
    cp -r $1/* ./
    sed -i 's/href="\//href=".\//g' index.html
    sed -i 's/src="\//src=".\//g' index.html
}
# parameter: the dir of built source code 
buildFolderPath=../demo-dev/dist
build $buildFolderPath