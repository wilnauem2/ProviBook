/**
 * Migration Script: loginInfo.type 'username_password' → 'direct_login'
 * 
 * Grund: "Benutzername und Passwort" ist inhaltlich identisch mit 
 * "Direkter Login im Maklerportal". Die Option wurde aus dem UI entfernt,
 * bestehende Firestore-Einträge müssen migriert werden.
 * 
 * Nutzung: In der Browser-Konsole aufrufen:
 *   import { migrateLoginType } from './scripts/migrateLoginType.js'
 *   await migrateLoginType()
 * 
 * Oder über die temporäre UI-Integration (siehe unten).
 */
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

export async function migrateLoginType(dryRun = false) {
  const collectionName = 'insurers';
  console.log(`[Migration] Starte Migration: loginInfo.type 'username_password' → 'direct_login'`);
  console.log(`[Migration] Modus: ${dryRun ? 'DRY RUN (keine Änderungen)' : 'LIVE'}`);

  try {
    const insurersRef = collection(db, collectionName);
    const snapshot = await getDocs(insurersRef);

    let total = 0;
    let migrated = 0;
    const affected = [];

    for (const docSnap of snapshot.docs) {
      total++;
      const data = docSnap.data();

      if (data.loginInfo?.type === 'username_password') {
        affected.push({ id: docSnap.id, name: data.name || '(kein Name)' });

        if (!dryRun) {
          const insurerRef = doc(db, collectionName, docSnap.id);
          await updateDoc(insurerRef, {
            'loginInfo.type': 'direct_login'
          });
        }
        migrated++;
      }
    }

    console.log(`[Migration] Ergebnis:`);
    console.log(`  - Gesamt geprüft: ${total}`);
    console.log(`  - Betroffene Einträge: ${migrated}`);
    if (affected.length > 0) {
      console.log(`  - Migrierte Versicherer:`);
      affected.forEach(a => console.log(`    • ${a.name} (${a.id})`));
    } else {
      console.log(`  - Keine Einträge mit 'username_password' gefunden.`);
    }
    console.log(`[Migration] ${dryRun ? 'DRY RUN abgeschlossen.' : 'Migration abgeschlossen.'}`);

    return { total, migrated, affected };
  } catch (error) {
    console.error('[Migration] Fehler:', error);
    throw error;
  }
}
