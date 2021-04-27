# CapRover Backup

## Restore

1. Restore volumes 
   
    `restic restore latest --target /var/lib/docker --tag "volumes"`

1. Restore config

   `restic dump latest --tag "config" > /captain/backup.tar`

1. Start CapRover with restore procedure

   https://caprover.com/docs/backup-and-restore.html#restoration-process