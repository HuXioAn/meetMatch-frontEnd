
#!/bin/bash

ask_continue() {
    read -p "Do you want to continue? (y/n): " choice
    case "$choice" in
        y|Y ) return 0 ;;
        n|N ) return 1 ;;
        * ) echo "Please enter y/Y or n/N." && ask_continue ;;
    esac
}

if [ $# -eq 0 ]; then
    echo "No arguments provided. Exiting with error code 1."
    exit 1
fi

path=$1
root=$2
if [ -d "$path" ]; then
    cd "$path" || { echo "Failed to change directory. Exiting with error code 2."; exit 2; }
    echo "Changed to directory: $path"
    npm run build
    if [ -d "./dist" ]; then
        cd "./dist"
        echo "[*]Payload:"
        ls
    else
        exit 1
    fi

    echo "[*]Destinartion: $root"
    ask_continue
    continue=$?
    if [ $continue -eq 0 ]; then
        echo "Continuing..."
    else
        echo "Exiting."
        exit 0
    fi
    ssh root@meetmatch.us "rm -rf $root/*; ls $root"
    scp -r ./* root@meetmatch.us:$root/

else
    echo "The provided path is not a directory. Exiting with error code 3."
    exit 3
fi


