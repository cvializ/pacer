#/bin/bash
openssl req -x509 \
  -newkey rsa:4096 \
  -keyout key.pem.new \
  -out cert.pem.new \
  -days 365 \
  -subj "/C=US/ST=Denial/L=Springfield/O=Carlos/CN=192.168.51.6"
