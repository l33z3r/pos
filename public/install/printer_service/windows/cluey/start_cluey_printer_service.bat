cd c:\cluey\jetty-distribution-7.5.3.v20111011

java -Dorg.eclipse.jetty.server.Request.maxFormContentSize=2000000 -Dopen_cash_drawer_batch_file_path=c:\cluey\open_cash_drawer_exe.bat -jar start.jar