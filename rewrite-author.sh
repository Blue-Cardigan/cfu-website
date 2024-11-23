#!/bin/bash
git filter-repo --email-callback '
    return email if email != b"phil.a.lefevre@gmail.com" else b"jethro.reeve@gmail.com"
' --name-callback '
    return name if email != b"phil.a.lefevre@gmail.com" else b"Red-Cardigan"
'