<?php

// $number = filter_var("4.39239E-05", FILTER_VALIDATE_FLOAT);
$num = 4.39239E-05;
// $n = 4.39518e+7;  
$num = $num*100000;                  //YOUR NUMBER
printf("SCINO = '%e'\n", $num);     
//%e specifies sci-notation


printf("FLOAT = '%d'\n", $num);   
// %d specifies decimal


?>