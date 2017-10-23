#!/bin/bash
clear; curl http://localhost:3000/correios/prazo-entrega -X POST -v -H "Content-type: application/json" -d @files/dados_entrega.json | json_pp 
