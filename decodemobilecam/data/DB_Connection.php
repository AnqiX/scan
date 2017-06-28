<?php
	


//executes the sql query to the database on DNAENGGSK2 ManufacturingEngineering
function executeAQueryManEng($sqlStatement) 
{
    $serverName = "DNAENGGSK2"; 
	$connectionInfo = array( "Database"=>"scan", "UID"=>"scan_reader", "PWD"=>"Solut1onst3@m2017");  
//    $serverName = "GMC10001\SQLEXPRESS"; 
//    $connectionInfo = array( "Database"=>"Ignition_db", "UID"=>"downtime_log", "PWD"=>"solutionsteam");  
	$conn = sqlsrv_connect( $serverName, $connectionInfo);  

	if( $conn ) 
	{
	}
	else
	{
		echo " SQL Connection could not be established.<br>";
		die( print_r( sqlsrv_errors(), true));
	}

    if($conn === FALSE)
    {
        die(print_r(sqlsrv_errors(), TRUE));
    }
    $rs = GetQueryForMSQLServerReturn($conn, $sqlStatement);
    //sqlsrv_free_stmt($rs);
    //sqlsrv_close($conn);
    return $rs;
}

function GetQueryForMSQLServerReturn($conn, $query)
{
    //Returns a statement resource on success and FALSE if an error occurred.
    $result = sqlsrv_query($conn,$query);

    if ($result)
    {
        //The next row of data is returned as an associative array. The array keys are the column names in the result set.
        while( $row = sqlsrv_fetch_array( $result, SQLSRV_FETCH_ASSOC))
        {
            //store data in array that will be returned
            $myarray[] = $row;
        }
    }
    
    /* Free statement and connection resources. */
   // sqlsrv_free_stmt( $result );
    //sqlsrv_close( $conn );
    if(isset($myarray))
    {
        return $myarray;
    }
    else
    {
        return false;
    }
}

?>