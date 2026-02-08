<template>
  <div v-if="insurer" class="fixed inset-0 bg-slate-900/40 backdrop-blur-[3px] flex items-center justify-center z-40 p-4 sm:p-6" @click.self="handleClose">

    <div class="bg-white rounded-2xl w-full max-w-[56rem] max-h-[92vh] flex flex-col shadow-soft-xl border border-slate-200/60 animate-scale-in" role="dialog" aria-modal="true" :aria-labelledby="`insurer-name-${insurer.id}`">

      <!-- ═══ HEADER ═══ -->
      <div class="flex-shrink-0 sticky top-0 z-10 bg-white/90 backdrop-blur-xl rounded-t-2xl border-b border-slate-100 px-6 py-4">
        <div class="flex items-center justify-between gap-4">
          <!-- Left: Name + Badges -->
          <div class="flex-1 min-w-0">
            <div v-if="!isEditing || editField !== 'name'" class="flex items-center gap-3">
              <h2 :id="`insurer-name-${insurer.id}`" class="text-lg font-bold text-slate-900 truncate tracking-tight">{{ insurer.name }}</h2>
              <button @click="startEditing('name')" class="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-brand-500 transition-all p-1 rounded-lg hover:bg-brand-50" title="Name bearbeiten">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"/></svg>
              </button>
              <div class="flex items-center gap-1.5 ml-auto flex-shrink-0">
                <div class="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full" :class="statusInfo.badgeClass">
                  <span class="w-1.5 h-1.5 rounded-full animate-pulse-soft" :class="statusInfo.dotClass"></span>
                  {{ statusInfo.text }}
                </div>
                <span v-if="insurer.bipro || insurer.bezugsweg === 'BiPRO'" class="px-2 py-1 bg-violet-50 text-violet-600 text-[10px] font-bold rounded-full border border-violet-200/60 tracking-wide">BiPRO</span>
              </div>
            </div>
            <div v-else class="space-y-2">
              <input v-model="editedName" class="w-full text-lg font-bold border border-slate-200 rounded-xl px-3.5 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" placeholder="Versicherer Name" autofocus/>
              <div class="flex justify-end gap-2">
                <button @click="cancelEditing()" class="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Abbrechen</button>
                <button @click="saveField('name')" class="px-3.5 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
              </div>
            </div>
          </div>
          <!-- Right: Actions -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <button @click="confirmDelete" class="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50" title="Versicherer löschen">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
            <button @click="handleClose" class="text-slate-300 hover:text-slate-600 transition-colors p-2 rounded-xl hover:bg-slate-100" title="Schliessen">
              <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- ═══ SCROLLABLE BODY ═══ -->
      <div class="flex-1 overflow-y-auto">
        <div class="px-6 py-5">

          <!-- ─── Summary Strip ─── -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div class="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
              <dt class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Letzte Abrechnung</dt>
              <dd class="text-sm font-bold text-slate-800 tabular-nums">{{ formattedLastInvoiceDate }}</dd>
            </div>
            <div class="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
              <dt class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Nächste Fälligkeit</dt>
              <dd class="text-sm font-bold tabular-nums" :class="statusInfo.text === 'Überfällig' ? 'text-red-600' : statusInfo.text === 'OK' ? 'text-amber-600' : 'text-slate-800'">{{ nextDueDate }}</dd>
            </div>
            <div class="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
              <dt class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Turnus</dt>
              <dd class="text-sm font-bold text-slate-800">{{ formattedTurnus }}</dd>
            </div>
            <div class="flex items-center justify-center">
              <button @click="showDatePicker = true" class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-[0.98]">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Erledigt
              </button>
            </div>
          </div>

          <!-- ─── Two-Column Layout ─── -->
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-5">

            <!-- LEFT: Kommentar + Timeline (3/5) -->
            <div class="lg:col-span-3 space-y-5">
              <!-- Kommentar -->
              <div class="bg-white rounded-xl border border-slate-200/70 overflow-hidden">
                <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                  <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Kommentar</h3>
                  <button @click="startEditing('comment')" class="text-[11px] font-semibold text-brand-500 hover:text-brand-600 transition-colors">Bearbeiten</button>
                </div>
                <div class="px-5 py-4">
                  <div v-if="isEditing && editField === 'comment'">
                    <textarea v-model="editedComment" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" rows="4" placeholder="Kommentar hier eingeben..."></textarea>
                    <div class="mt-3 flex justify-end gap-2">
                      <button @click="cancelEditing()" class="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Abbrechen</button>
                      <button @click="saveField('comment')" class="px-3.5 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
                    </div>
                  </div>
                  <div v-else>
                    <p v-if="insurer.comment" class="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{{ insurer.comment }}</p>
                    <p v-else class="text-sm text-slate-400 italic">Kein Kommentar vorhanden.</p>
                  </div>
                </div>
              </div>

              <!-- Timeline -->
              <Timeline :events="timelineEvents" @event-click="handleTimelineEventClick" @delete-event="handleTimelineDeleteEvent"/>
            </div>

            <!-- RIGHT: Detail Cards (2/5) -->
            <div class="lg:col-span-2 space-y-4">

              <!-- Card: Abrechnungsdetails -->
              <div class="bg-white rounded-xl border border-slate-200/70 overflow-hidden">
                <div class="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                  <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Abrechnungsdetails</h3>
                </div>
                <div class="px-5 py-4 space-y-4">

                  <!-- Turnus -->
                  <div class="group">
                    <div class="flex justify-between items-center">
                      <dt class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Turnus</dt>
                      <button @click="startEditing('turnus')" class="opacity-0 group-hover:opacity-100 text-[11px] font-semibold text-brand-500 hover:text-brand-600 transition-all">Ändern</button>
                    </div>
                    <dd v-if="!isEditing || editField !== 'turnus'" class="text-sm font-medium text-slate-800 mt-1">{{ insurer.turnus ? formatTurnus(insurer.turnus) : 'Nicht festgelegt' }}</dd>
                    <div v-else class="mt-1.5 space-y-2">
                      <select v-model="editedTurnus" class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" autofocus>
                        <option v-for="option in turnusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                      </select>
                      <div class="flex justify-end gap-2">
                        <button @click="cancelEditing()" class="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Abbrechen</button>
                        <button @click="saveField('turnus')" class="px-3 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
                      </div>
                    </div>
                  </div>

                  <hr class="border-slate-100"/>

                  <!-- Zustellungsweg -->
                  <div class="group">
                    <div class="flex justify-between items-center">
                      <dt class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Zustellungsweg</dt>
                      <div class="flex items-center gap-1">
                        <button v-if="getSafeZustellungsweg()" @click.stop="deleteField('zustellungsweg')" class="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-0.5 rounded" title="Entfernen">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        <button @click.stop="startEditing('zustellungsweg')" class="opacity-0 group-hover:opacity-100 text-[11px] font-semibold text-brand-500 hover:text-brand-600 transition-all">Ändern</button>
                      </div>
                    </div>
                    <dd v-if="!isEditing || editField !== 'zustellungsweg'" class="mt-1">
                      <span v-if="getSafeZustellungsweg() === 'BiPRO'" class="inline-flex items-center px-2.5 py-0.5 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full border border-violet-200/60">BiPRO</span>
                      <span v-else-if="getSafeZustellungsweg()" class="text-sm font-medium text-slate-800">{{ getSafeZustellungsweg() }}</span>
                      <span v-else class="text-xs text-slate-400 italic">Keine Angabe</span>
                    </dd>
                    <div v-else class="mt-1.5 space-y-2">
                      <select v-model="editedZustellungsweg" class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" @click.stop>
                        <option value="">Bitte auswählen...</option>
                        <option v-for="option in zustellungswegOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                      </select>
                      <div class="flex justify-end gap-2">
                        <button @click.stop="cancelEditing()" class="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Abbrechen</button>
                        <button @click.stop="saveField('zustellungsweg')" class="px-3 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all" :disabled="!editedZustellungsweg">Speichern</button>
                      </div>
                    </div>
                  </div>

                  <hr class="border-slate-100"/>

                  <!-- Dokumentenart -->
                  <div class="group">
                    <div class="flex justify-between items-center">
                      <dt class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Dokumentenart</dt>
                      <div class="flex items-center gap-1">
                        <button v-if="insurer.dokumentenart" @click="deleteField('dokumentenart')" class="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-0.5 rounded" title="Entfernen">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        <button @click="startEditing('dokumentenart')" class="opacity-0 group-hover:opacity-100 text-[11px] font-semibold text-brand-500 hover:text-brand-600 transition-all">Ändern</button>
                      </div>
                    </div>
                    <div v-if="!isEditing || editField !== 'dokumentenart'" class="mt-1.5">
                      <div v-if="insurer.dokumentenart && getNormalizedDocTypes(insurer.dokumentenart).length" class="flex flex-wrap gap-1.5">
                        <span v-for="docType in getNormalizedDocTypes(insurer.dokumentenart)" :key="docType" class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold" :class="utils.docTypeColors[docType]?.classes || 'bg-slate-100 text-slate-600'">
                          {{ docType }}
                        </span>
                      </div>
                      <span v-else class="text-xs text-slate-400 italic">Keine Angabe</span>
                    </div>
                    <div v-else class="mt-2 space-y-2.5">
                      <div class="grid grid-cols-1 gap-1.5">
                        <label v-for="docType in allDocTypes" :key="docType" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                          <input type="checkbox" :value="docType" v-model="editedDokumentenart" class="h-3.5 w-3.5 text-brand-500 border-slate-300 rounded focus:ring-brand-500/30 transition-colors">
                          <span class="text-xs text-slate-700">{{ docType }}</span>
                        </label>
                      </div>
                      <div class="flex justify-end gap-2">
                        <button @click="cancelEditing()" class="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Abbrechen</button>
                        <button @click="saveField('dokumentenart')" class="px-3 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card: Einstellungen -->
              <div class="bg-white rounded-xl border border-slate-200/70 overflow-hidden">
                <div class="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                  <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Einstellungen</h3>
                </div>
                <div class="px-5 py-4 space-y-4">

                  <!-- Vemapool -->
                  <div class="flex items-center justify-between">
                    <div>
                      <dt class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Vemapool</dt>
                      <dd class="text-[11px] text-slate-400 mt-0.5">Stempel auf Kachel anzeigen</dd>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="editedVemapool" class="sr-only peer" @change="saveField('vemapool')">
                      <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>

                  <hr class="border-slate-100"/>

                  <!-- Login-Informationen -->
                  <div class="group">
                    <div class="flex justify-between items-center">
                      <dt class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Login-Informationen</dt>
                      <button @click="startEditing('loginInfo')" class="opacity-0 group-hover:opacity-100 text-[11px] font-semibold text-brand-500 hover:text-brand-600 transition-all">Ändern</button>
                    </div>
                    <div v-if="!isEditing || editField !== 'loginInfo'" class="mt-1.5">
                      <div class="space-y-1.5">
                        <span v-if="props.insurer.loginInfo?.type" class="inline-flex items-center px-2.5 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-semibold rounded-full border border-brand-200/60">
                          {{ getLoginTypeLabel(props.insurer.loginInfo.type) }}
                        </span>
                        <p v-if="props.insurer.loginInfo?.customNotes" class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg leading-relaxed">{{ props.insurer.loginInfo.customNotes }}</p>
                        <span v-if="!props.insurer.loginInfo?.type && !props.insurer.loginInfo?.customNotes" class="text-xs text-slate-400 italic">Nicht hinterlegt</span>
                      </div>
                    </div>
                    <div v-else class="mt-2 space-y-2.5">
                      <select v-model="editedLoginInfo.type" class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all">
                        <option value="">Bitte auswählen...</option>
                        <option v-for="option in loginTypeOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                      </select>
                      <textarea v-model="editedLoginInfo.customNotes" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" rows="2" placeholder="Hinweise zum Login..."></textarea>
                      <div class="flex justify-end gap-2">
                        <button @click="cancelEditing()" class="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Abbrechen</button>
                        <button @click="saveField('loginInfo')" class="px-3 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card: Abrechnungswege -->
              <div class="bg-white rounded-xl border border-slate-200/70 overflow-hidden">
                <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                  <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Abrechnungswege</h3>
                  <button @click="startEditing('abrechnungswege')" class="text-[11px] font-semibold text-brand-500 hover:text-brand-600 transition-colors">Bearbeiten</button>
                </div>
                <div class="px-5 py-4">
                  <div v-if="!isEditing || editField !== 'abrechnungswege'" class="space-y-2.5">
                    <!-- CSV -->
                    <div class="flex items-center justify-between p-3 rounded-lg" :class="props.insurer.abrechnungswege?.csv?.enabled ? 'bg-emerald-50/60 border border-emerald-100' : 'bg-slate-50 border border-slate-100'">
                      <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-lg flex items-center justify-center" :class="props.insurer.abrechnungswege?.csv?.enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        <div>
                          <span class="text-xs font-semibold text-slate-700">CSV/Excel</span>
                          <p v-if="props.insurer.abrechnungswege?.csv?.enabled && props.insurer.abrechnungswege.csv.description" class="text-[11px] text-slate-500 mt-0.5 leading-snug">{{ props.insurer.abrechnungswege.csv.description }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <a v-if="props.insurer.abrechnungswege?.csv?.enabled && props.insurer.abrechnungswege.csv.link" :href="props.insurer.abrechnungswege.csv.link.startsWith('http') ? props.insurer.abrechnungswege.csv.link : 'https://' + props.insurer.abrechnungswege.csv.link" target="_blank" rel="noopener" class="text-brand-500 hover:text-brand-600 p-1 rounded-lg hover:bg-brand-50 transition-colors" title="Link öffnen">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        </a>
                        <span class="text-[10px] font-bold uppercase tracking-wider" :class="props.insurer.abrechnungswege?.csv?.enabled ? 'text-emerald-600' : 'text-slate-400'">{{ props.insurer.abrechnungswege?.csv?.enabled ? 'Aktiv' : 'Inaktiv' }}</span>
                      </div>
                    </div>
                    <!-- PDF -->
                    <div class="flex items-center justify-between p-3 rounded-lg" :class="props.insurer.abrechnungswege?.pdf?.enabled ? 'bg-emerald-50/60 border border-emerald-100' : 'bg-slate-50 border border-slate-100'">
                      <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-lg flex items-center justify-center" :class="props.insurer.abrechnungswege?.pdf?.enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                        </div>
                        <div>
                          <span class="text-xs font-semibold text-slate-700">PDF</span>
                          <p v-if="props.insurer.abrechnungswege?.pdf?.enabled && props.insurer.abrechnungswege.pdf.description" class="text-[11px] text-slate-500 mt-0.5 leading-snug">{{ props.insurer.abrechnungswege.pdf.description }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <a v-if="props.insurer.abrechnungswege?.pdf?.enabled && props.insurer.abrechnungswege.pdf.link" :href="props.insurer.abrechnungswege.pdf.link.startsWith('http') ? props.insurer.abrechnungswege.pdf.link : 'https://' + props.insurer.abrechnungswege.pdf.link" target="_blank" rel="noopener" class="text-brand-500 hover:text-brand-600 p-1 rounded-lg hover:bg-brand-50 transition-colors" title="Link öffnen">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        </a>
                        <span class="text-[10px] font-bold uppercase tracking-wider" :class="props.insurer.abrechnungswege?.pdf?.enabled ? 'text-emerald-600' : 'text-slate-400'">{{ props.insurer.abrechnungswege?.pdf?.enabled ? 'Aktiv' : 'Inaktiv' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Edit Mode -->
                  <div v-else class="space-y-3">
                    <div v-for="channel in ['csv', 'pdf']" :key="channel" class="border border-slate-200/80 rounded-lg p-3">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-semibold text-slate-700">{{ channel === 'csv' ? 'CSV/Excel' : 'PDF' }}</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" v-model="editedAbrechnungswege[channel].enabled" class="sr-only peer">
                          <div class="w-8 h-[18px] bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-brand-500"></div>
                        </label>
                      </div>
                      <div v-if="editedAbrechnungswege[channel].enabled" class="space-y-2">
                        <input v-model="editedAbrechnungswege[channel].link" type="text" class="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" :placeholder="`Link zum ${channel === 'csv' ? 'CSV/Excel' : 'PDF'} Download...`">
                        <textarea v-model="editedAbrechnungswege[channel].description" class="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" rows="2" placeholder="Beschreibung..."></textarea>
                      </div>
                    </div>
                    <div class="flex justify-end gap-2 pt-1">
                      <button @click="cancelEditing()" class="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Abbrechen</button>
                      <button @click="saveField('abrechnungswege')" class="px-3 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ SUB-MODALS ═══ -->

    <!-- Date Picker -->
    <div v-if="showDatePicker" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="handleCancel">
      <div class="bg-white rounded-2xl shadow-soft-xl w-full max-w-sm animate-scale-in overflow-hidden">
        <div class="px-6 pt-6 pb-4">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <h3 class="text-base font-bold text-slate-900 mb-0.5">Abrechnung erfassen</h3>
          <p class="text-xs text-slate-400 mb-5">Datum und optionale Notiz eintragen.</p>
          <div class="space-y-3">
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Datum</label>
              <input type="date" v-model="selectedDate" class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"/>
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Notiz</label>
              <textarea v-model="settlementNote" class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" rows="2" placeholder="Optional..."></textarea>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button @click="handleCancel" class="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">Abbrechen</button>
          <button @click="handleDateSubmit" class="px-5 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 shadow-sm shadow-emerald-500/25 transition-all">Erfassen</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-soft-xl max-w-sm w-full animate-scale-in overflow-hidden">
        <div class="px-6 pt-6 pb-4">
          <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </div>
          <h3 class="text-base font-bold text-slate-900 mb-1">Versicherer löschen?</h3>
          <p class="text-sm text-slate-500">Möchten Sie <strong class="text-slate-700">{{ insurer.name }}</strong> endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
        </div>
        <div class="flex justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button @click="showDeleteConfirmation = false" class="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">Abbrechen</button>
          <button @click="deleteInsurer" class="px-5 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all">Löschen</button>
        </div>
      </div>
    </div>

    <!-- Settlement Delete Confirmation -->
    <div v-if="showSettlementDeleteConfirmation" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-soft-xl max-w-sm w-full animate-scale-in overflow-hidden">
        <div class="px-6 pt-6 pb-4">
          <h3 class="text-base font-bold text-slate-900 mb-1">Abrechnung löschen?</h3>
          <p class="text-sm text-slate-500">Möchten Sie diesen Abrechnungseintrag wirklich löschen?</p>
        </div>
        <div class="flex justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button @click="cancelSettlementDelete" class="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">Abbrechen</button>
          <button @click="executeDeleteSettlement" class="px-5 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all">Löschen</button>
        </div>
      </div>
    </div>

    <!-- Settlement Details -->
    <div v-if="showSettlementModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showSettlementModal = false">
      <div class="bg-white rounded-2xl shadow-soft-xl w-full max-w-md animate-scale-in overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 class="text-sm font-bold text-slate-900">Abrechnungsdetails</h3>
          <button @click="showSettlementModal = false" class="text-slate-300 hover:text-slate-500 p-1 rounded-lg hover:bg-slate-100 transition-all">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="px-6 py-5 space-y-4">
          <div>
            <dt class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Datum</dt>
            <dd class="mt-0.5 text-sm font-bold text-slate-900 tabular-nums">{{ selectedSettlement ? format(selectedSettlement.date.toDate ? selectedSettlement.date.toDate() : new Date(selectedSettlement.date), 'dd.MM.yyyy') : '' }}</dd>
          </div>
          <div>
            <dt class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Kommentar</dt>
            <dd v-if="selectedSettlement?.note" class="mt-0.5 text-sm text-slate-700 whitespace-pre-line leading-relaxed">{{ selectedSettlement.note }}</dd>
            <dd v-else class="mt-0.5 text-sm text-slate-400 italic">Kein Kommentar</dd>
          </div>
        </div>
        <div class="flex justify-end px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button @click="showSettlementModal = false" class="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">Schließen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject, nextTick } from 'vue';
import { useInsurerStore } from '@/stores/insurerStore.js';
import { useActivityStore } from '@/stores/activityStore.js';
import { useInsurerUtils, allDocTypes } from '@/composables/useInsurerUtils.js';
import { format, differenceInDays, addDays } from 'date-fns';
import Timeline from '@/components/Timeline.vue';

// Toast notification functions
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  // Add to body and trigger animation
  document.body.appendChild(toast);
  
  // Remove after delay
  setTimeout(() => {
    toast.remove();
  }, 3000);
};

const showSuccessToast = (message) => showToast(message, 'success');
const showErrorToast = (message) => showToast(message, 'error');

// Date picker related state and functions
// (State variables moved to the main state section below)

const handleDateSubmit = async () => {
  try {
    if (!selectedDate.value) {
      showErrorToast('Bitte wählen Sie ein Datum aus');
      return;
    }

    // Create a clean date object at noon to avoid timezone issues
    const settlementDate = new Date(selectedDate.value);
    settlementDate.setHours(12, 0, 0, 0);
    
    // Create a Firestore-compatible date
    const firestoreDate = new Date(settlementDate);
    
    const settlementData = {
      date: firestoreDate,
      note: settlementNote.value || null,
      createdAt: new Date()
    };

    // Save the new invoice and get the updated insurer data
    const updatedInsurer = await insurerStore.addInvoiceToHistory(props.insurer.id, settlementData);
    
    // Create a new last_invoice object with proper date handling
    const newLastInvoice = {
      date: firestoreDate,
      note: settlementNote.value || null,
      id: updatedInsurer.id || Date.now().toString()
    };
    
    // Update local state
    localLastInvoice.value = newLastInvoice;
    
    // Force a re-render of the nextDueDate computed property
    await nextTick();
    
    // Reset form
    showDatePicker.value = false;
    selectedDate.value = '';
    settlementNote.value = '';
    
    // Show success message
    showSuccessToast('Abrechnung erfolgreich erfasst');
    
    // Create a new insurer object with the updated last_invoice
    const updatedInsurerData = {
      ...props.insurer,
      last_invoice: newLastInvoice,
      // Ensure turnus is set, default to 7 days if not set
      turnus: props.insurer.turnus || '7'
    };
    
    // Emit the update to the parent component
    emit('update:insurer', updatedInsurerData);
    
    // Refresh the settlements list
    await fetchSettlements();
  } catch (error) {
    console.error('Error adding settlement:', error);
    showErrorToast('Fehler beim Speichern der Abrechnung');
    showDatePicker.value = false; // Close modal on error
  }
};

const handleCancel = () => {
  showDatePicker.value = false;
  selectedDate.value = '';
  settlementNote.value = '';
};

// Define all component emits in one place
const emit = defineEmits(['close', 'delete-insurer', 'settlement-completed', 'update:insurer', 'insurer-deleted']);

// Utils object referencing docTypeColors defined below
const utils = { docTypeColors: null };

const props = defineProps({
  insurer: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  },
  dataMode: {
    type: String,
    default: 'production'
  }
});

const insurerStore = useInsurerStore();
const activityStore = useActivityStore();
const { getStatusColor, getStatusText, calculateDaysOverdue, getNormalizedDocTypes, formatLastInvoice } = useInsurerUtils();

// Compute status info for the current insurer
const statusInfo = computed(() => {
  const daysOverdue = calculateDaysOverdue(props.insurer);
  
  if (daysOverdue > 5) {
    return {
      text: 'Überfällig',
      badgeClass: 'border-red-200 bg-red-50 text-red-800',
      dotClass: 'text-red-500'
    };
  } else if (daysOverdue > 0) {
    return {
      text: 'OK',
      badgeClass: 'border-yellow-200 bg-yellow-50 text-yellow-800',
      dotClass: 'text-yellow-500'
    };
  } else {
    return {
      text: 'Aktuell',
      badgeClass: 'border-green-200 bg-green-50 text-green-800',
      dotClass: 'text-green-500'
    };
  }
});

// Editing state
const isEditing = ref(false);
const editField = ref(null);
const isSaving = ref(false);

// State - Create a ref to store the local last invoice
const localLastInvoice = ref(null);

// Computed property that returns either the local value or falls back to the store
const currentLastInvoice = computed(() => {
  const invoice = localLastInvoice.value || insurerStore.lastInvoices[props.insurer?.id];
  
  if (!invoice) return null;
  
  // Return a new object to ensure reactivity
  return {
    ...invoice,
    // Ensure date is always a proper Date object
    date: (() => {
      try {
        if (!invoice.date) return null;
        
        // Handle Firestore Timestamp
        if (invoice.date.toDate) return invoice.date.toDate();
        
        // Handle Date object
        if (invoice.date instanceof Date) return new Date(invoice.date);
        
        // Handle string format
        if (typeof invoice.date === 'string') {
          // Check if it's DD.MM.YYYY format
          if (invoice.date.includes('.')) {
            const parts = invoice.date.split('.');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
              const year = parseInt(parts[2], 10);
              return new Date(year, month, day);
            }
          }
          // Try ISO format
          return new Date(invoice.date);
        }
        
        // Fallback
        return new Date(invoice.date);
      } catch (e) {
        console.error('Error parsing invoice date:', e, invoice.date);
        return null;
      }
    })()
  };
});

const sortedLocalSettlements = computed(() => {
  // Start with a copy of the local settlement history
  let settlements = [...localSettlementHistory.value];
  
  // If we have a last invoice that's not already in the history, include it
  if (currentLastInvoice.value && currentLastInvoice.value.date) {
    const lastInvoiceDate = currentLastInvoice.value.date?.toDate ? 
      currentLastInvoice.value.date.toDate() : new Date(currentLastInvoice.value.date);
    
    // Check if the last invoice is already in the history
    const isInHistory = settlements.some(settlement => {
      const settlementDate = settlement.date?.toDate ? 
        settlement.date.toDate() : new Date(settlement.date);
      return settlementDate.getTime() === lastInvoiceDate.getTime();
    });
    
    // If not in history, add it
    if (!isInHistory) {
      settlements.push({
        id: 'last_invoice',
        date: currentLastInvoice.value.date,
        note: currentLastInvoice.value.note || 'Letzte Abrechnung',
        isLastInvoice: true
      });
    }
  }
  
  // Sort by date (newest first)
  return settlements.sort((a, b) => {
    const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
    const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
    return dateB - dateA;
  });
});

const localSettlementHistory = ref([]);
const showDatePicker = ref(false);
const selectedDate = ref('');
const settlementNote = ref('');
const showDeleteConfirmation = ref(false);
// Settlement related state
const showSettlementDeleteConfirmation = ref(false);
const settlementToDeleteId = ref(null);
const showSettlementModal = ref(false);
const selectedSettlement = ref(null);

// Form fields
const editedName = ref('');
const editedComment = ref('');
const editedTurnus = ref('');
const editedZustellungsweg = ref('');
const editedDokumentenart = ref([]);
const editedVemapool = ref(false);
const editedLoginInfo = ref({
  type: '',
  customNotes: ''
});
const editedAbrechnungswege = ref({
  csv: {
    enabled: false,
    link: '',
    description: ''
  },
  pdf: {
    enabled: false,
    link: '',
    description: ''
  }
});

// Options for login types
const loginTypeOptions = [
  { value: 'direct_login', label: 'Direkter Login im Maklerportal' },
  { value: 'easylogin', label: 'EasyLogin' },
  { value: 'certificate', label: 'Zertifikat' },
  { value: 'other', label: 'Sonstiges' }
];

// Helper function to get login type label
const getLoginTypeLabel = (type) => {
  const option = loginTypeOptions.find(opt => opt.value === type);
  return option ? option.label : type;
};

// Document type colors with classes and icons
const docTypeColors = {
  'PDF (STANDARD) - CSV AUF WUNSCH MÖGLICH (PER MAIL ANFORDERN)': {
    classes: 'bg-blue-100 text-blue-800',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'
  },
  'PAPIER (STANDARD) - CSV AUF WUNSCH MÖGLICH (PER MAIL ANFORDERN)': {
    classes: 'bg-slate-100 text-slate-800',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'
  },
  'XLS': {
    classes: 'bg-emerald-100 text-emerald-800',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'
  },
  'XML': {
    classes: 'bg-amber-100 text-amber-800',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>'
  },
  'PDF': {
    classes: 'bg-red-100 text-red-800',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>'
  },
  'CSV': {
    classes: 'bg-blue-100 text-blue-800',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'
  },
  'Papier': {
    classes: 'bg-slate-100 text-slate-800',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'
  }
};
// Wire up utils reference
utils.docTypeColors = docTypeColors;

// Options
// Use canonical numeric string values for the select to avoid format mismatches
const turnusOptions = [
  { value: '7', label: '7-tägig' },
  { value: '14', label: '14-tägig' },
  { value: '31', label: '31-tägig' },
  { value: '365', label: 'Jährlich' },
];
const zustellungswegOptions = [
  { value: 'E-Mail', label: 'E-Mail' },
  { value: 'Per Post', label: 'Per Post' },
  { value: 'BiPRO', label: 'BiPRO' },
  { value: 'GMI', label: 'GMI' },
  { value: 'Maklerportal/GetMyInvoices', label: 'Maklerportal/GetMyInvoices' }
];

// Field names for display
const fieldNames = {
  name: 'Name',
  comment: 'Kommentar',
  turnus: 'Turnus',
  zustellungsweg: 'Zustellungsweg',
  dokumentenart: 'Dokumentenart',
  vemapool: 'Vemapool',
  loginInfo: 'Login-Informationen',
  abrechnungswege: 'Abrechnungswege'
};

// Helper method to safely get zustellungsweg value
const getSafeZustellungsweg = (insurer = props.insurer) => {
  if (!insurer) return '';
  
  const zustellungsweg = insurer.zustellungsweg || insurer.zustellweg || insurer.bezugsweg;
  if (!zustellungsweg) return '';
  
  // Handle different possible formats
  let result = '';
  
  if (typeof zustellungsweg === 'string') {
    result = zustellungsweg;
  } else if (Array.isArray(zustellungsweg)) {
    // If it's an array, take the first item
    const firstItem = zustellungsweg[0];
    if (typeof firstItem === 'object' && firstItem !== null) {
      result = firstItem.value || firstItem.label || firstItem.name || '';
    } else {
      result = firstItem || '';
    }
  } else if (typeof zustellungsweg === 'object' && zustellungsweg !== null) {
    result = zustellungsweg.value || zustellungsweg.label || zustellungsweg.name || '';
  }
  
  return result;
};

// Watch for insurer changes to initialize all local states
watch(() => props.insurer, (newInsurer) => {
  if (newInsurer) {
    // Initialize editable fields
    editedName.value = newInsurer.name || '';
    editedComment.value = newInsurer.comment || '';
    // Normalize turnus from prop (supports '7', '7-tägig', 'Jährlich') to numeric string ('7','14','31','365') for the select
    editedTurnus.value = normalizeTurnusForStore(newInsurer.turnus || '');
    editedZustellungsweg.value = getSafeZustellungsweg(newInsurer);
    editedDokumentenart.value = getNormalizedDocTypes(newInsurer.dokumentenart);
    editedVemapool.value = newInsurer.vemapool || false;
    
    // Initialize new fields
    editedLoginInfo.value = {
      type: newInsurer.loginInfo?.type || '',
      customNotes: newInsurer.loginInfo?.customNotes || ''
    };
    editedAbrechnungswege.value = {
      csv: {
        enabled: newInsurer.abrechnungswege?.csv?.enabled || false,
        link: newInsurer.abrechnungswege?.csv?.link || '',
        description: newInsurer.abrechnungswege?.csv?.description || ''
      },
      pdf: {
        enabled: newInsurer.abrechnungswege?.pdf?.enabled || false,
        link: newInsurer.abrechnungswege?.pdf?.link || '',
        description: newInsurer.abrechnungswege?.pdf?.description || ''
      }
    };

    // Initialize local last invoice
    if (newInsurer.last_invoice) {
      let date = null;
      try {
        if (newInsurer.last_invoice.date?.toDate) {
          // Firestore Timestamp
          date = newInsurer.last_invoice.date.toDate();
        } else if (newInsurer.last_invoice.date instanceof Date) {
          // Already a Date object
          date = new Date(newInsurer.last_invoice.date);
        } else if (typeof newInsurer.last_invoice.date === 'string') {
          // Handle string formats
          if (newInsurer.last_invoice.date.includes('.')) {
            // DD.MM.YYYY format
            const parts = newInsurer.last_invoice.date.split('.');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
              const year = parseInt(parts[2], 10);
              date = new Date(year, month, day);
            }
          } else {
            // Try ISO format
            date = new Date(newInsurer.last_invoice.date);
          }
        } else if (newInsurer.last_invoice.date) {
          // Fallback
          date = new Date(newInsurer.last_invoice.date);
        }
        
        // Validate the parsed date
        if (date && isNaN(date.getTime())) {
          console.error('Invalid date after parsing:', newInsurer.last_invoice.date);
          date = null;
        }
      } catch (e) {
        console.error('Error parsing last_invoice date:', e, newInsurer.last_invoice.date);
        date = null;
      }
      
      localLastInvoice.value = { ...newInsurer.last_invoice, date };
    } else {
      localLastInvoice.value = null;
    }

    // Fetch settlement history for the new insurer
    fetchSettlements();

    // Reset editing state
    cancelEditing();
  }
}, { immediate: true });

// Format the last invoice date for display
const formattedLastInvoiceDate = computed(() => {
  if (!currentLastInvoice.value || !currentLastInvoice.value.date) return 'Keine Abrechnung';
  try {
    // currentLastInvoice.value.date is already a Date object
    const date = currentLastInvoice.value.date;
    if (!date || isNaN(date.getTime())) return 'Ungültiges Datum';
    return format(date, 'dd.MM.yyyy');
  } catch (e) {
    console.error('Error formatting last invoice date:', e);
    return 'Ungültiges Datum';
  }
});

// Calculate next due date based on turnus and last invoice date
const nextDueDate = computed(() => {
  try {
    let lastDate = null;
    
    if (currentLastInvoice.value?.date) {
      lastDate = currentLastInvoice.value.date;
    }
    
    if (!lastDate && localLastInvoice.value?.date) {
      lastDate = localLastInvoice.value.date;
    }
    
    if (!lastDate && props.insurer?.id && insurerStore.lastInvoices[props.insurer.id]?.date) {
      const storeInvoice = insurerStore.lastInvoices[props.insurer.id];
      lastDate = storeInvoice.date?.toDate ? storeInvoice.date.toDate() : new Date(storeInvoice.date);
    }
    
    if (!lastDate) return 'Nicht verfügbar';
    if (!(lastDate instanceof Date) || isNaN(lastDate.getTime())) return 'Ungültiges Datum';
    
    let turnusDays = 7;
    if (props.insurer?.turnus) {
      turnusDays = parseInt(String(props.insurer.turnus), 10);
      if (isNaN(turnusDays) || turnusDays <= 0) turnusDays = 7;
    }
    
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + turnusDays);
    
    const day = String(nextDate.getDate()).padStart(2, '0');
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const year = nextDate.getFullYear();
    return `${day}.${month}.${year}`;
  } catch (e) {
    console.error('Error calculating next due date:', e);
    return 'Fehler';
  }
});

// Helper function to check if a field is empty
const isFieldEmpty = (field) => {
  return field === undefined || field === null || field === '' || (Array.isArray(field) && field.length === 0);
};

const confirmDelete = () => {
  showDeleteConfirmation.value = true;
};

const deleteInsurer = async () => {
  try {
    const insurerName = props.insurer.name;
    const insurerId = props.insurer.id;
    
    await insurerStore.deleteInsurer(insurerId);
    
    await activityStore.logActivity(activityStore.ActivityType.INSURER_DELETED, {
      entityType: 'insurer',
      entityId: insurerId,
      entityName: insurerName,
      description: `Versicherer "${insurerName}" gelöscht`
    });
    
    showSuccessToast('Versicherer erfolgreich gelöscht');
    showDeleteConfirmation.value = false;
    emit('insurer-deleted', insurerId);
    handleClose();
  } catch (error) {
    console.error('Error deleting insurer:', error);
    showErrorToast('Fehler beim Löschen des Versicherers');
  }
};

const deleteField = async (field) => {
  try {
    const updateData = { [field]: field === 'dokumentenart' ? [] : '' };
    await insurerStore.updateInsurer(props.insurer.id, updateData);
    showSuccessToast(`${fieldNames[field] || field} wurde entfernt.`);
    emit('update:insurer', { ...props.insurer, ...updateData });
  } catch (error) {
    console.error(`Error deleting field ${field}:`, error);
    showErrorToast(`Fehler beim Entfernen von ${fieldNames[field] || field}.`);
  }
};

const formatDate = (date) => {
  if (!date) return 'Unbekannt';
  try {
    const d = date.toDate ? date.toDate() : new Date(date);
    if (isNaN(d.getTime())) return 'Unbekannt';
    return format(d, 'dd.MM.yyyy');
  } catch { return 'Unbekannt'; }
};

const handleClose = () => {
  emit('close');
};

const showSettlementDetails = (settlement) => {
  selectedSettlement.value = settlement;
  showSettlementModal.value = true;
};

// Settlement delete functions
const confirmSettlementDelete = (settlementId) => {
  settlementToDeleteId.value = settlementId;
  showSettlementDeleteConfirmation.value = true;
};

const cancelSettlementDelete = () => {
  settlementToDeleteId.value = null;
  showSettlementDeleteConfirmation.value = false;
};

const executeDeleteSettlement = async () => {
  if (!settlementToDeleteId.value) return;
  
  try {
    // Get settlement details before deleting for activity log
    const settlement = localSettlementHistory.value.find(s => s.id === settlementToDeleteId.value);
    const settlementDate = settlement?.date || settlement?.datum || 'Unbekannt';
    
    await insurerStore.deleteSettlement(props.insurer.id, settlementToDeleteId.value);
    
    // Log activity
    await activityStore.logActivity(activityStore.ActivityType.BILLING_DELETED, {
      entityType: 'insurer',
      entityId: props.insurer.id,
      entityName: props.insurer.name,
      changes: { 
        settlementId: settlementToDeleteId.value,
        date: settlementDate
      },
      description: `Abrechnung vom ${formatDate(settlementDate)} gelöscht für "${props.insurer.name}"`
    });
    
    // Update local settlement history
    localSettlementHistory.value = localSettlementHistory.value.filter(
      s => s.id !== settlementToDeleteId.value
    );
    
    showSuccessToast('Abrechnung erfolgreich gelöscht');
    
    // Refresh settlements from store
    await fetchSettlements();
  } catch (error) {
    console.error('Error deleting settlement:', error);
    showErrorToast('Fehler beim Löschen der Abrechnung');
  } finally {
    cancelSettlementDelete();
  }
};

const startEditing = (field) => {
  isEditing.value = true;
  editField.value = field;
  
  switch(field) {
    case 'name':
      editedName.value = props.insurer.name || '';
      break;
    case 'comment':
      editedComment.value = props.insurer.comment || '';
      break;
    case 'turnus':
      editedTurnus.value = props.insurer.turnus || '';
      break;
    case 'zustellungsweg':
      const currentZustellungsweg = getSafeZustellungsweg(props.insurer);
      editedZustellungsweg.value = currentZustellungsweg;
      break;
    case 'dokumentenart':
      editedDokumentenart.value = getNormalizedDocTypes(props.insurer.dokumentenart);
      break;
    case 'vemapool':
      break;
    case 'loginInfo':
      editedLoginInfo.value = {
        type: props.insurer.loginInfo?.type || '',
        customNotes: props.insurer.loginInfo?.customNotes || ''
      };
      break;
    case 'abrechnungswege':
      editedAbrechnungswege.value = {
        csv: {
          enabled: props.insurer.abrechnungswege?.csv?.enabled || false,
          link: props.insurer.abrechnungswege?.csv?.link || '',
          description: props.insurer.abrechnungswege?.csv?.description || ''
        },
        pdf: {
          enabled: props.insurer.abrechnungswege?.pdf?.enabled || false,
          link: props.insurer.abrechnungswege?.pdf?.link || '',
          description: props.insurer.abrechnungswege?.pdf?.description || ''
        }
      };
      break;
  }
};

const cancelEditing = () => {
  isEditing.value = false;
  editField.value = null;
};

const formatTurnus = (turnus) => {
  if (!turnus) return 'Kein Turnus festgelegt';
  
  // If it's already in the correct format, return as is
  if (String(turnus).includes('-tägig') || turnus === 'Jährlich') {
    return turnus;
  }
  
  // Otherwise, try to extract the number and add '-tägig'
  const days = String(turnus).replace(/[^0-9]/g, '');
  return days ? `${days}-tägig` : turnus;
};

const formattedTurnus = computed(() => {
  return formatTurnus(props.insurer.turnus);
});

// Normalize 'X-tägig' or labels to digits for storing in the store; keep existing digits as-is
const normalizeTurnusForStore = (val) => {
  if (!val) return '';
  if (typeof val === 'number') return String(val);
  const s = String(val);
  if (s.toLowerCase() === 'jährlich') return '365';
  const m = s.match(/\d+/);
  return m ? m[0] : s;
};

// Transform settlement history into timeline events
const timelineEvents = computed(() => {
  const events = [];
  
  // Add settlement history events
  sortedLocalSettlements.value.forEach((settlement) => {
    const date = settlement.date?.toDate ? settlement.date.toDate() : new Date(settlement.date);
    
    events.push({
      id: settlement.id,
      type: 'settlement',
      title: settlement.isLastInvoice ? 'Aktuelle Abrechnung erfasst' : 'Abrechnung erfasst',
      description: `Abrechnung vom ${format(date, 'dd.MM.yyyy')} wurde erfasst`,
      date: date,
      note: settlement.note,
      isLastInvoice: settlement.isLastInvoice,
      metadata: settlement.isLastInvoice ? { Status: 'Aktuell' } : null,
      deletable: !settlement.isLastInvoice,
    });
  });
  
  // Add creation event if we have an insurer
  if (props.insurer?.createdAt) {
    const createdDate = props.insurer.createdAt.toDate ? 
      props.insurer.createdAt.toDate() : 
      new Date(props.insurer.createdAt);
    
    events.push({
      id: 'creation',
      type: 'creation',
      title: 'Versicherer erstellt',
      description: `${props.insurer.name} wurde zur Datenbank hinzugefügt`,
      date: createdDate,
      metadata: {
        Turnus: formatTurnus(props.insurer.turnus),
      },
    });
  }
  
  // Sort events by date (newest first)
  return events.sort((a, b) => b.date - a.date);
});

// Handle timeline event clicks
const handleTimelineEventClick = (event) => {
  if (event.type === 'settlement') {
    // Find the settlement in sortedLocalSettlements
    const settlement = sortedLocalSettlements.value.find(s => s.id === event.id);
    if (settlement) {
      showSettlementDetails(settlement);
    }
  }
};

// Handle timeline delete event
const handleTimelineDeleteEvent = (event) => {
  if (event.type === 'settlement' && !event.isLastInvoice) {
    confirmSettlementDelete(event.id);
  }
};

const saveField = async (field) => {
  isSaving.value = true;
  try {
    let updateData = {};
    let successMessage = '';

    switch (field) {
      case 'name':
        if (!editedName.value.trim()) {
          showErrorToast('Der Name darf nicht leer sein.');
          return;
        }
        updateData = { name: editedName.value };
        successMessage = 'Name erfolgreich aktualisiert.';
        break;
      case 'comment':
        updateData = { comment: editedComment.value };
        successMessage = 'Kommentar erfolgreich gespeichert.';
        break;
      case 'turnus':
        // Save normalized numeric string value back to the store
        updateData = { turnus: editedTurnus.value };
        successMessage = 'Turnus erfolgreich aktualisiert.';
        break;
      case 'zustellungsweg':
        updateData = { zustellungsweg: editedZustellungsweg.value };
        successMessage = 'Zustellungsweg aktualisiert.';
        break;
      case 'dokumentenart':
        updateData = { dokumentenart: editedDokumentenart.value };
        successMessage = 'Dokumentenart aktualisiert.';
        break;
      case 'vemapool':
        updateData = { vemapool: editedVemapool.value };
        successMessage = `Vemapool ${editedVemapool.value ? 'aktiviert' : 'deaktiviert'}.`;
        break;
      case 'loginInfo':
        updateData = { loginInfo: { ...editedLoginInfo.value } };
        successMessage = 'Login-Informationen aktualisiert.';
        break;
      case 'abrechnungswege':
        updateData = { abrechnungswege: { ...editedAbrechnungswege.value } };
        successMessage = 'Abrechnungswege aktualisiert.';
        break;
      default:
        console.warn('Unhandled field save:', field);
        return;
    }

    await insurerStore.updateInsurer(props.insurer.id, updateData);
    showSuccessToast(successMessage);
    
    // Log activity
    const activityType = field === 'name' ? activityStore.ActivityType.NAME_UPDATED :
                        field === 'turnus' ? activityStore.ActivityType.TURNUS_UPDATED :
                        field === 'dokumentenart' ? activityStore.ActivityType.DOKUMENTENART_UPDATED :
                        field === 'zustellungsweg' ? activityStore.ActivityType.ZUSTELLUNGSWEG_UPDATED :
                        field === 'comment' ? activityStore.ActivityType.COMMENT_UPDATED :
                        field === 'vemapool' ? activityStore.ActivityType.VEMAPOOL_UPDATED :
                        field === 'loginInfo' ? (activityStore.ActivityType.LOGIN_INFO_UPDATED || activityStore.ActivityType.FIELD_UPDATED) :
                        field === 'abrechnungswege' ? (activityStore.ActivityType.ABRECHNUNGSWEGE_UPDATED || activityStore.ActivityType.FIELD_UPDATED) :
                        activityStore.ActivityType.FIELD_UPDATED;
    
    await activityStore.logActivity(activityType, {
      entityType: 'insurer',
      entityId: props.insurer.id,
      entityName: field === 'name' ? updateData.name : props.insurer.name,
      changes: { [field]: updateData[field] },
      description: successMessage
    });

    emit('update:insurer', { ...props.insurer, ...updateData });

    // Watch for the prop to update, then cancel editing.
    // This prevents a race condition where the UI reverts to the old value
    // before the parent component has processed the update.
    const unwatch = watch(() => props.insurer,
      (newInsurer) => {
        if (newInsurer[field] === updateData[field]) {
          cancelEditing();
          unwatch(); // Stop watching immediately after success
        }
      },
      { deep: true } // Deep watch is needed here to catch the property change
    );

    // Failsafe: if the prop doesn't update in 2 seconds, cancel editing anyway.
    setTimeout(() => {
      unwatch();
      cancelEditing();
    }, 2000);

  } catch (error) {
    console.error(`Error saving field ${field}:`, error);
    showErrorToast(`Fehler beim Speichern von ${field}.`);
  } finally {
    isSaving.value = false;
  }
};

// Fetch settlement history when component mounts or dataMode changes
const fetchSettlements = async () => {
  try {
    const settlements = await insurerStore.fetchSettlements(props.insurer.id, props.dataMode);
    localSettlementHistory.value = settlements || [];
  } catch (error) {
    console.error('Error fetching settlements:', error);
    showErrorToast('Fehler beim Laden der Abrechnungen');
  }
};

// Watch for changes to insurer or dataMode
watch([() => props.insurer, () => props.dataMode], () => {
  fetchSettlements();
}, { immediate: true, deep: true });

// Watch for changes in the store's settlement history
watch(() => insurerStore.settlementHistories[props.insurer?.id], (newHistory) => {
  if (newHistory) {
    localSettlementHistory.value = newHistory;
  }
}, { immediate: true, deep: true });


onMounted(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  selectedDate.value = `${year}-${month}-${day}`;
});
</script>
