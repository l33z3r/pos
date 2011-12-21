#!/bin/sh
cd /home/lee/work/pos/resources/jetty-distribution-7.5.3.v20111011
java -Dorg.eclipse.jetty.server.Request.maxFormContentSize=2000000 -Dprinter_path=/dev/usb/lp0 -Dcash_drawer_code_text_file_path=/home/lee/work/pos/resources/jetty-distribution-7.5.3.v20111011/cash_drawer_code.txt -jar start.jar
