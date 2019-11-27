if [ "$1"  == "--ci" ]; then
  echo "Ensuring fresh install"
  rm -rf node_modules;
  npm install;
fi

export CI=true;

echo "Linking this repo to NPM"
npm link


echo "Installing Testing Platform"
rm -rf test/sandbox
mkdir -p test/sandbox
cd test/sandbox
git clone https://github.com/digital-taco/react-draft-testing
cd react-draft-testing
npm install;
npm link react-draft

npm run draft&

cd ../../../

sleep 30; # need to allow time for things to boot up

npm run jest-tests; kill $!;