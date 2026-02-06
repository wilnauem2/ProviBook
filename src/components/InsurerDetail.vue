<template>
  <div v-if="insurer" class="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center z-40 overflow-y-auto" @click.self="handleClose">

    <!-- Main Insurer Detail Modal -->
    <div class="bg-slate-50 rounded-2xl w-[60vw] max-h-[90vh] overflow-y-auto shadow-soft-xl border border-slate-200/50 transform transition-all animate-scale-in" role="dialog" aria-modal="true" :aria-labelledby="`insurer-name-${insurer.id}`">
      
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white/85 backdrop-blur-xl z-10 border-b border-slate-200/80 px-6 py-4 sm:px-8">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <div v-if="!isEditing || editField !== 'name'" class="flex items-center gap-2.5">
              <h2 :id="`insurer-name-${insurer.id}`" class="text-lg sm:text-xl font-semibold text-slate-900 truncate tracking-tight">{{ insurer.name }}</h2>
              <button @click="startEditing('name')" class="text-slate-300 hover:text-brand-500 transition-colors p-1 rounded-md hover:bg-brand-50" title="Name bearbeiten">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path></svg>
              </button>
            </div>
            <div v-else>
              <input v-model="editedName" class="w-full text-lg sm:text-xl font-semibold border border-slate-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" placeholder="Versicherer Name" autofocus/>
              <div class="mt-2 flex justify-end gap-2">
                <button @click="cancelEditing()" class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">Abbrechen</button>
                <button @click="saveField('name')" class="px-3 py-1.5 text-xs font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 sm:gap-2 ml-4">
            <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg border" :class="statusInfo.badgeClass">
              <span class="w-1.5 h-1.5 rounded-full" :class="statusInfo.dotClass"></span>
              <span>{{ statusInfo.text }}</span>
            </div>
            <span v-if="insurer.bipro || insurer.bezugsweg === 'BiPRO'" class="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 text-[11px] font-semibold rounded-lg border border-purple-200">
              BiPRO
            </span>
            <button @click="confirmDelete" class="text-slate-300 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50" title="Versicherer löschen">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
            <button @click="handleClose" class="text-slate-300 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100" title="Schliessen">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-5 sm:p-6">
        <!-- Summary Bar -->
        <div class="bg-white rounded-xl p-4 mb-6 border border-slate-200/80">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Column 1: Last Invoice -->
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-4.5 h-4.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <dt class="text-[11px] font-medium text-slate-400">Letzte Abrechnung</dt>
                <dd class="text-sm font-semibold text-slate-900 tabular-nums">{{ formattedLastInvoiceDate }}</dd>
              </div>
            </div>

            <!-- Column 2: Next Due Date -->
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-4.5 h-4.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <dt class="text-[11px] font-medium text-slate-400">Nächste Fälligkeit</dt>
                <dd class="text-sm font-semibold text-slate-900 tabular-nums">{{ nextDueDate }}</dd>
              </div>
            </div>

            <!-- Column 3: Turnus -->
            <div class="flex items-center gap-3 md:border-l md:border-slate-100 md:pl-4">
              <div class="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-4.5 h-4.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </div>
              <div>
                <dt class="text-[11px] font-medium text-slate-400">Turnus</dt>
                <dd class="text-sm font-semibold text-slate-800">{{ formattedTurnus }}</dd>
              </div>
            </div>

            <!-- Column 4: Action -->
            <div class="flex items-center justify-start md:justify-end">
              <button @click="showDatePicker = true" class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-xl shadow-sm shadow-emerald-500/20 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Abrechnung erledigt
              </button>
            </div>

          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Left Column: Overview -->
          <div class="space-y-5">
            <!-- Kommentar Card -->
            <div class="bg-white p-5 rounded-xl border border-slate-200/80 transition-all duration-200 hover:shadow-soft">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-slate-900">Kommentar</h3>
                <button @click="startEditing('comment')" class="text-slate-400 hover:text-brand-500 transition-colors text-xs font-medium px-2 py-1 rounded-md hover:bg-brand-50">Bearbeiten</button>
              </div>
              <div v-if="isEditing && editField === 'comment'">
                <textarea v-model="editedComment" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" rows="4" placeholder="Kommentar hier eingeben..."></textarea>
                <div class="mt-2 flex justify-end gap-2">
                  <button @click="cancelEditing()" class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">Abbrechen</button>
                  <button @click="saveField('comment')" class="px-3 py-1.5 text-xs font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
                </div>
              </div>
              <div v-else>
                <p v-if="insurer.comment" class="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{{ insurer.comment }}</p>
                <p v-else class="text-sm text-slate-400 italic">Kein Kommentar vorhanden.</p>
              </div>
            </div>

            <!-- Timeline View -->
            <Timeline
              :events="timelineEvents"
              @event-click="handleTimelineEventClick"
              @delete-event="handleTimelineDeleteEvent"
            />
          </div>

          <!-- Right Column: Details -->
          <div class="space-y-5">
            <div class="bg-white p-5 rounded-xl border border-slate-200/80 transition-all duration-200 hover:shadow-soft">
              <h3 class="text-sm font-semibold text-slate-900 mb-4">Details zur Abrechnung</h3>
              <dl class="space-y-4">
                <!-- Turnus -->
                <div>
                  <div class="flex justify-between items-center group">
                    <dt class="text-xs font-medium text-slate-400">Turnus</dt>
                    <button @click="startEditing('turnus')" class="text-slate-400 hover:text-brand-500 transition-colors text-xs font-medium px-2 py-1 rounded-md hover:bg-brand-50">Bearbeiten</button>
                  </div>
                  <dd v-if="!isEditing || editField !== 'turnus'" class="text-sm text-slate-900 font-medium mt-1">{{ insurer.turnus ? formatTurnus(insurer.turnus) : 'Kein Turnus festgelegt' }}</dd>
                  <div v-else>
                    <select 
                      v-model="editedTurnus" 
                      class="w-40 text-sm border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all"
                      autofocus
                    >
                      <option v-for="option in turnusOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                    <div class="mt-2 flex justify-end gap-2">
                      <button @click="cancelEditing()" class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">Abbrechen</button>
                      <button @click="saveField('turnus')" class="px-3 py-1.5 text-xs font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
                    </div>
                  </div>
                </div>

                <!-- Zustellungsweg -->
                <div>
                  <div class="flex justify-between items-center group">
                    <dt class="text-xs font-medium text-slate-400">Zustellungsweg</dt>
                    <div class="flex items-center gap-1">
                      <button v-if="getSafeZustellungsweg()" @click.stop="deleteField('zustellungsweg')" class="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1 rounded" title="Zustellungsweg löschen">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                      <button @click.stop="startEditing('zustellungsweg')" class="text-slate-400 hover:text-brand-500 transition-colors text-xs font-medium px-2 py-1 rounded-md hover:bg-brand-50">Bearbeiten</button>
                    </div>
                  </div>
                  
                  <dd v-if="!isEditing || editField !== 'zustellungsweg'" class="text-sm text-slate-900 font-medium mt-1">
                    <span v-if="getSafeZustellungsweg()" class="inline-flex items-center">
                      <template v-if="getSafeZustellungsweg() === 'BiPRO'">
                        <span class="inline-flex items-center px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-md border border-purple-100">BiPRO</span>
                      </template>
                      <template v-else-if="getSafeZustellungsweg() === 'E-Mail'">
                        <span class="text-slate-900">E-Mail</span>
                      </template>
                      <template v-else-if="getSafeZustellungsweg() === 'Per Post'">
                        <span class="text-slate-900">Per Post</span>
                      </template>
                      <template v-else-if="getSafeZustellungsweg() === 'Maklerportal/GetMyInvoices' || getSafeZustellungsweg() === 'Maklerportal'">
                        <span class="text-slate-900">Maklerportal/GetMyInvoices</span>
                      </template>
                      <template v-else>
                        <span class="text-slate-900">{{ getSafeZustellungsweg() }}</span>
                      </template>
                    </span>
                    <span v-else class="text-slate-400 italic text-xs">Keine Angabe</span>
                  </dd>
                  
                  <div v-else class="mt-1">
                    <select 
                      v-model="editedZustellungsweg" 
                      class="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all"
                      @click.stop
                    >
                      <option value="">Bitte auswählen...</option>
                      <option v-for="option in zustellungswegOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                    <div class="mt-2 flex justify-end gap-2">
                      <button @click.stop="cancelEditing()" class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">Abbrechen</button>
                      <button @click.stop="saveField('zustellungsweg')" class="px-3 py-1.5 text-xs font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all" :disabled="!editedZustellungsweg">
                        Speichern
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Dokumentenart -->
                <div class="pt-3 border-t border-slate-100">
                  <div class="flex justify-between items-center group">
                    <dt class="text-xs font-medium text-slate-400">Dokumentenart</dt>
                    <div class="flex items-center gap-1">
                      <button v-if="insurer.dokumentenart" @click="deleteField('dokumentenart')" class="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1 rounded" title="Dokumentenart löschen">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                      <button @click="startEditing('dokumentenart')" class="text-slate-400 hover:text-brand-500 transition-colors text-xs font-medium px-2 py-1 rounded-md hover:bg-brand-50">Bearbeiten</button>
                    </div>
                  </div>
                  <div v-if="!isEditing || editField !== 'dokumentenart'">
                    <div v-if="insurer.dokumentenart && getNormalizedDocTypes(insurer.dokumentenart).length" class="flex flex-wrap gap-1.5 mt-2">
                      <span v-for="docType in getNormalizedDocTypes(insurer.dokumentenart)" :key="docType" 
                            class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
                            :class="utils.docTypeColors[docType]?.classes || 'bg-slate-100 text-slate-700'">
                        <svg v-if="utils.docTypeColors[docType]?.icon" class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="utils.docTypeColors[docType]?.icon"></svg>
                        {{ docType }}
                      </span>
                    </div>
                    <p v-else class="text-xs text-slate-400 italic mt-2">Keine Angabe</p>
                  </div>
                  <div v-else>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                      <div v-for="docType in allDocTypes" :key="docType" class="flex items-center">
                        <input type="checkbox" :id="`doc-type-${docType}`" :value="docType" v-model="editedDokumentenart" class="h-3.5 w-3.5 text-brand-500 border-slate-300 rounded focus:ring-brand-500/30 transition-colors">
                        <label :for="`doc-type-${docType}`" class="ml-2 text-xs text-slate-600">{{ docType }}</label>
                      </div>
                    </div>
                    <div class="mt-3 flex justify-end gap-2">
                      <button @click="cancelEditing()" class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">Abbrechen</button>
                      <button @click="saveField('dokumentenart')" class="px-3 py-1.5 text-xs font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
                    </div>
                  </div>
                </div>

                <!-- Vemapool -->
                <div class="pt-3 border-t border-slate-100">
                  <div class="flex justify-between items-center">
                    <div>
                      <dt class="text-xs font-medium text-slate-400">Vemapool</dt>
                      <dd class="text-[11px] text-slate-400 mt-0.5">Aktivieren, falls Vemapool-Stempel angezeigt werden soll</dd>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="editedVemapool" class="sr-only peer" @change="saveField('vemapool')">
                      <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                </div>

                <!-- Login-Informationen -->
                <div class="pt-3 border-t border-slate-100">
                  <div class="flex justify-between items-center mb-3">
                    <div>
                      <dt class="text-xs font-medium text-slate-400">Login-Informationen</dt>
                      <dd class="text-[11px] text-slate-400 mt-0.5">Art des Zugangs zum Maklerportal</dd>
                    </div>
                    <button @click="startEditing('loginInfo')" class="text-slate-400 hover:text-brand-500 transition-colors text-xs font-medium px-2 py-1 rounded-md hover:bg-brand-50">Bearbeiten</button>
                  </div>
                  
                  <div v-if="!isEditing || editField !== 'loginInfo'">
                    <div class="space-y-2">
                      <div v-if="props.insurer.loginInfo?.type" class="flex items-center">
                        <span class="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-medium rounded border border-blue-100">
                          {{ getLoginTypeLabel(props.insurer.loginInfo.type) }}
                        </span>
                      </div>
                      <div v-if="props.insurer.loginInfo?.customNotes" class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg leading-relaxed">
                        {{ props.insurer.loginInfo.customNotes }}
                      </div>
                      <div v-if="!props.insurer.loginInfo?.type && !props.insurer.loginInfo?.customNotes" class="text-xs text-slate-400 italic">
                        Keine Login-Informationen hinterlegt
                      </div>
                    </div>
                  </div>
                  
                  <div v-else class="space-y-3">
                    <div>
                      <label class="block text-xs font-medium text-slate-500 mb-1">Login-Typ</label>
                      <select v-model="editedLoginInfo.type" class="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all">
                        <option value="">Bitte auswählen...</option>
                        <option v-for="option in loginTypeOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-500 mb-1">Individuelle Hinweise</label>
                      <textarea v-model="editedLoginInfo.customNotes" 
                                class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" 
                                rows="3" 
                                placeholder="Besondere Hinweise zum Login..."></textarea>
                    </div>
                    <div class="flex justify-end gap-2">
                      <button @click="cancelEditing()" class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">Abbrechen</button>
                      <button @click="saveField('loginInfo')" class="px-3 py-1.5 text-xs font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
                    </div>
                  </div>
                </div>

                <!-- Abrechnungswege -->
                <div class="pt-3 border-t border-slate-100">
                  <div class="flex justify-between items-center mb-3">
                    <div>
                      <dt class="text-xs font-medium text-slate-400">Abrechnungswege</dt>
                      <dd class="text-[11px] text-slate-400 mt-0.5">Wo finde ich die Abrechnungsdaten?</dd>
                    </div>
                    <button @click="startEditing('abrechnungswege')" class="text-slate-400 hover:text-brand-500 transition-colors text-xs font-medium px-2 py-1 rounded-md hover:bg-brand-50">Bearbeiten</button>
                  </div>
                  
                  <div v-if="!isEditing || editField !== 'abrechnungswege'">
                    <div class="space-y-2.5">
                      <!-- CSV/Excel Weg -->
                      <div class="border border-slate-200/80 rounded-lg p-2.5">
                        <div class="flex items-center justify-between mb-1.5">
                          <span class="text-xs font-medium text-slate-700">CSV/Excel</span>
                          <span v-if="props.insurer.abrechnungswege?.csv?.enabled" class="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">Verfügbar</span>
                          <span v-else class="text-[10px] font-medium bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded border border-slate-100">Nicht verfügbar</span>
                        </div>
                        <div v-if="props.insurer.abrechnungswege?.csv?.enabled" class="space-y-1 text-xs text-slate-500">
                          <div v-if="props.insurer.abrechnungswege.csv.link">
                            <a v-if="props.insurer.abrechnungswege.csv.link.startsWith('http')" 
                               :href="props.insurer.abrechnungswege.csv.link" 
                               target="_blank" 
                               class="text-brand-600 hover:text-brand-700 hover:underline truncate block">{{ props.insurer.abrechnungswege.csv.link }}</a>
                            <span v-else class="truncate block">{{ props.insurer.abrechnungswege.csv.link }}</span>
                          </div>
                          <p v-if="props.insurer.abrechnungswege.csv.description" class="text-slate-500 leading-relaxed">{{ props.insurer.abrechnungswege.csv.description }}</p>
                        </div>
                      </div>
                      
                      <!-- PDF Weg -->
                      <div class="border border-slate-200/80 rounded-lg p-2.5">
                        <div class="flex items-center justify-between mb-1.5">
                          <span class="text-xs font-medium text-slate-700">PDF</span>
                          <span v-if="props.insurer.abrechnungswege?.pdf?.enabled" class="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">Verfügbar</span>
                          <span v-else class="text-[10px] font-medium bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded border border-slate-100">Nicht verfügbar</span>
                        </div>
                        <div v-if="props.insurer.abrechnungswege?.pdf?.enabled" class="space-y-1 text-xs text-slate-500">
                          <div v-if="props.insurer.abrechnungswege.pdf.link">
                            <a v-if="props.insurer.abrechnungswege.pdf.link.startsWith('http')" 
                               :href="props.insurer.abrechnungswege.pdf.link" 
                               target="_blank" 
                               class="text-brand-600 hover:text-brand-700 hover:underline truncate block">{{ props.insurer.abrechnungswege.pdf.link }}</a>
                            <span v-else class="truncate block">{{ props.insurer.abrechnungswege.pdf.link }}</span>
                          </div>
                          <p v-if="props.insurer.abrechnungswege.pdf.description" class="text-slate-500 leading-relaxed">{{ props.insurer.abrechnungswege.pdf.description }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div v-else class="space-y-3">
                    <!-- CSV/Excel Bearbeitung -->
                    <div class="border border-slate-200/80 rounded-lg p-2.5">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-medium text-slate-700">CSV/Excel</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" v-model="editedAbrechnungswege.csv.enabled" class="sr-only peer">
                          <div class="w-8 h-[18px] bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-brand-500"></div>
                        </label>
                      </div>
                      <div v-if="editedAbrechnungswege.csv.enabled" class="space-y-2">
                        <input v-model="editedAbrechnungswege.csv.link" type="text" class="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" placeholder="Link zum CSV/Excel Download...">
                        <textarea v-model="editedAbrechnungswege.csv.description" class="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" rows="2" placeholder="Beschreibung des Weges..."></textarea>
                      </div>
                    </div>
                    
                    <!-- PDF Bearbeitung -->
                    <div class="border border-slate-200/80 rounded-lg p-2.5">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-medium text-slate-700">PDF</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" v-model="editedAbrechnungswege.pdf.enabled" class="sr-only peer">
                          <div class="w-8 h-[18px] bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-brand-500"></div>
                        </label>
                      </div>
                      <div v-if="editedAbrechnungswege.pdf.enabled" class="space-y-2">
                        <input v-model="editedAbrechnungswege.pdf.link" type="text" class="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" placeholder="Link zum PDF Download...">
                        <textarea v-model="editedAbrechnungswege.pdf.description" class="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:outline-none transition-all" rows="2" placeholder="Beschreibung des Weges..."></textarea>
                      </div>
                    </div>
                    
                    <div class="flex justify-end gap-2">
                      <button @click="cancelEditing()" class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">Abbrechen</button>
                      <button @click="saveField('abrechnungswege')" class="px-3 py-1.5 text-xs font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
                    </div>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Date Picker Modal -->
    <div v-if="showDatePicker" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50" @click.self="handleCancel">
      <div class="bg-white rounded-2xl p-6 shadow-soft-xl w-full max-w-sm animate-scale-in">
        <h3 class="text-base font-semibold text-slate-900 mb-1">Abrechnungsdatum wählen</h3>
        <p class="text-xs text-slate-400 mb-4">Wählen Sie das Datum der erledigten Abrechnung.</p>
        <input type="date" v-model="selectedDate" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all mb-3"/>
        <textarea v-model="settlementNote" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all mb-4 placeholder-slate-400" rows="2" placeholder="Optionale Notiz..."></textarea>
        <div class="flex justify-end gap-2.5">
          <button @click="handleCancel" class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Abbrechen</button>
          <button @click="handleDateSubmit" class="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Bestätigen</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 shadow-soft-xl max-w-sm w-full animate-scale-in">
        <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
          <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </div>
        <h3 class="text-base font-semibold text-slate-900 mb-1">Versicherer löschen?</h3>
        <p class="text-sm text-slate-500 mb-5">Möchten Sie <strong class="text-slate-700">{{ insurer.name }}</strong> wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <div class="flex justify-end gap-2.5">
          <button @click="showDeleteConfirmation = false" class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Abbrechen</button>
          <button @click="deleteInsurer" class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all">Löschen</button>
        </div>
      </div>
    </div>

    <!-- Settlement Delete Confirmation Modal -->
    <div v-if="showSettlementDeleteConfirmation" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 shadow-soft-xl max-w-sm w-full animate-scale-in">
        <h3 class="text-base font-semibold text-slate-900 mb-1">Abrechnung löschen?</h3>
        <p class="text-sm text-slate-500 mb-5">Möchten Sie diesen Abrechnungseintrag wirklich löschen?</p>
        <div class="flex justify-end gap-2.5">
          <button @click="cancelSettlementDelete" class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Abbrechen</button>
          <button @click="executeDeleteSettlement" class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all">Löschen</button>
        </div>
      </div>
    </div>

    <!-- Settlement Details Modal -->
    <div v-if="showSettlementModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showSettlementModal = false">
      <div class="bg-white rounded-2xl shadow-soft-xl w-full max-w-md animate-scale-in">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-base font-semibold text-slate-900">Abrechnungsdetails</h3>
            <button @click="showSettlementModal = false" class="text-slate-300 hover:text-slate-500 p-1 rounded-lg hover:bg-slate-100 transition-all">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mt-4 space-y-3">
            <div>
              <dt class="text-xs font-medium text-slate-400">Datum</dt>
              <dd class="mt-0.5 text-sm font-medium text-slate-900 tabular-nums">{{ selectedSettlement ? format(selectedSettlement.date.toDate ? selectedSettlement.date.toDate() : new Date(selectedSettlement.date), 'dd.MM.yyyy') : '' }}</dd>
            </div>
            
            <div v-if="selectedSettlement?.note">
              <dt class="text-xs font-medium text-slate-400">Kommentar</dt>
              <dd class="mt-0.5 text-sm text-slate-700 whitespace-pre-line leading-relaxed">{{ selectedSettlement.note }}</dd>
            </div>
            <div v-else>
              <dt class="text-xs font-medium text-slate-400">Kommentar</dt>
              <dd class="mt-0.5 text-sm text-slate-400 italic">Kein Kommentar vorhanden</dd>
            </div>
          </div>
          
          <div class="mt-5 flex justify-end">
            <button @click="showSettlementModal = false" type="button" class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              Schließen
            </button>
          </div>
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

    console.log('Saving settlement data:', settlementData);
    
    // Save the new invoice and get the updated insurer data
    const updatedInsurer = await insurerStore.addInvoiceToHistory(props.insurer.id, settlementData);
    
    // Create a new last_invoice object with proper date handling
    const newLastInvoice = {
      date: firestoreDate,
      note: settlementNote.value || null,
      id: updatedInsurer.id || Date.now().toString()
    };
    
    console.log('New last invoice:', newLastInvoice);
    
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

// Initialize the utils object with docTypeColors
const utils = {
  docTypeColors: {
    'PDF (STANDARD) - CSV AUF WUNSCH MÖGLICH (PER MAIL ANFORDERN)': {
      classes: 'bg-blue-100 text-blue-800',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'
    },
    'PAPIER (STANDARD) - CSV AUF WUNSCH MÖGLICH (PER MAIL ANFORDERN)': {
      classes: 'bg-gray-100 text-gray-800',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'
    },
    'XLS': {
      classes: 'bg-green-100 text-green-800',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'
    },
    'XML': {
      classes: 'bg-yellow-100 text-yellow-800',
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
      classes: 'bg-gray-100 text-gray-800',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'
    }
  }
};

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
  { value: 'username_password', label: 'Benutzername und Passwort' },
  { value: 'other', label: 'Sonstiges' }
];

// Helper function to get login type label
const getLoginTypeLabel = (type) => {
  const option = loginTypeOptions.find(opt => opt.value === type);
  return option ? option.label : type;
};

// Document type colors (allDocTypes is imported from useInsurerUtils)
const docTypeColors = {
  'PDF (STANDARD) - CSV AUF WUNSCH MÖGLICH (PER MAIL ANFORDERN)': 'bg-blue-100 text-blue-800',
  'PAPIER (STANDARD) - CSV AUF WUNSCH MÖGLICH (PER MAIL ANFORDERN)': 'bg-gray-100 text-gray-800',
  'XLS': 'bg-green-100 text-green-800',
  'XML': 'bg-yellow-100 text-yellow-800',
  'PDF': 'bg-red-100 text-red-800',
  'CSV': 'bg-blue-100 text-blue-800',
  'Papier': 'bg-gray-100 text-gray-800',
};

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
  
  // Try different possible property names
  const zustellungsweg = insurer.zustellungsweg || insurer.zustellweg || insurer.bezugsweg;
  console.log('getSafeZustellungsweg - raw value:', zustellungsweg);
  
  if (!zustellungsweg) {
    console.log('No zustellungsweg found in insurer:', insurer);
    return '';
  }
  
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
  
  console.log('getSafeZustellungsweg - resolved value:', result);
  return result;
};

// Watch for insurer changes to initialize all local states
watch(() => props.insurer, (newInsurer) => {
  if (newInsurer) {
    console.log('Insurer changed, updating all local states.');
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
      console.log('Initialized localLastInvoice:', localLastInvoice.value);
    } else {
      localLastInvoice.value = null;
    }

    // Fetch settlement history for the new insurer
    fetchSettlements();

    // Reset editing state
    cancelEditing();
  }
}, { immediate: true });

// This is the duplicate and incorrect declaration. It will be removed.

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
    console.log('=== Calculating next due date ===');
    
    // Get last invoice date - try multiple sources
    let lastDate = null;
    
    // Try currentLastInvoice first
    if (currentLastInvoice.value?.date) {
      lastDate = currentLastInvoice.value.date;
      console.log('Using currentLastInvoice.date:', lastDate);
    }
    
    // If no date yet, try localLastInvoice
    if (!lastDate && localLastInvoice.value?.date) {
      lastDate = localLastInvoice.value.date;
      console.log('Using localLastInvoice.date:', lastDate);
    }
    
    // If still no date, try from store
    if (!lastDate && props.insurer?.id && insurerStore.lastInvoices[props.insurer.id]?.date) {
      const storeInvoice = insurerStore.lastInvoices[props.insurer.id];
      if (storeInvoice.date?.toDate) {
        lastDate = storeInvoice.date.toDate();
      } else {
        lastDate = new Date(storeInvoice.date);
      }
      console.log('Using store lastInvoice.date:', lastDate);
    }
    
    // If still no date, return not available
    if (!lastDate) {
      console.log('❌ No last invoice date found');
      return 'Nicht verfügbar';
    }
    
    // Ensure it's a valid Date object
    if (!(lastDate instanceof Date) || isNaN(lastDate.getTime())) {
      console.error('❌ Invalid date object:', lastDate);
      return 'Ungültiges Datum';
    }
    
    console.log('✅ Last date:', lastDate.toISOString(), lastDate.toString());
    
    // Get turnus
    let turnusDays = 7; // default
    if (props.insurer?.turnus) {
      turnusDays = parseInt(String(props.insurer.turnus), 10);
      if (isNaN(turnusDays) || turnusDays <= 0) {
        console.warn('⚠️ Invalid turnus, using default 7:', props.insurer.turnus);
        turnusDays = 7;
      }
    }
    console.log('✅ Turnus days:', turnusDays);
    
    // Calculate next date
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + turnusDays);
    
    console.log('✅ Next date:', nextDate.toISOString(), nextDate.toString());
    
    // Format manually
    const day = String(nextDate.getDate()).padStart(2, '0');
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const year = nextDate.getFullYear();
    const formatted = `${day}.${month}.${year}`;
    
    console.log('✅ Formatted:', formatted);
    return formatted;
    
  } catch (e) {
    console.error('❌❌❌ EXCEPTION in nextDueDate:', e);
    console.error('Stack:', e.stack);
    return 'Fehler';
  }
});

// Helper function to check if a field is empty
const isFieldEmpty = (field) => {
  return field === undefined || field === null || field === '' || (Array.isArray(field) && field.length === 0);
};

const confirmDelete = async () => {
  if (confirm('Möchten Sie diesen Versicherer wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
    try {
      const insurerName = props.insurer.name;
      const insurerId = props.insurer.id;
      
      await insurerStore.deleteInsurer(insurerId);
      
      // Log activity
      await activityStore.logActivity(activityStore.ActivityType.INSURER_DELETED, {
        entityType: 'insurer',
        entityId: insurerId,
        entityName: insurerName,
        description: `Versicherer "${insurerName}" gelöscht`
      });
      
      showSuccessToast('Versicherer erfolgreich gelöscht');
      emit('insurer-deleted', insurerId);
      handleClose();
    } catch (error) {
      console.error('Error deleting insurer:', error);
      showErrorToast('Fehler beim Löschen des Versicherers');
    }
  }
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
  console.log('Starting to edit field:', field);
  isEditing.value = true;
  editField.value = field;
  
  // Log all properties of the insurer for debugging
  console.log('All insurer properties in startEditing:', Object.keys(props.insurer));
  
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
      console.log('Raw zustellungsweg value before edit:', {
        zustellungsweg: props.insurer.zustellungsweg,
        zustellweg: props.insurer.zustellweg,
        bezugsweg: props.insurer.bezugsweg
      });
      const currentZustellungsweg = getSafeZustellungsweg(props.insurer);
      console.log('Setting editedZustellungsweg to:', currentZustellungsweg);
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
    
    const event = {
      id: settlement.id,
      type: 'settlement',
      title: settlement.isLastInvoice ? 'Aktuelle Abrechnung erfasst' : 'Abrechnung erfasst',
      description: `Abrechnung vom ${format(date, 'dd.MM.yyyy')} wurde erfasst`,
      date: date,
      note: settlement.note,
      isLastInvoice: settlement.isLastInvoice,
      metadata: settlement.isLastInvoice ? { Status: 'Aktuell' } : null,
      deletable: !settlement.isLastInvoice, // Explicit deletable flag
    };
    
    console.log('Timeline event created:', event);
    events.push(event);
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

    // Emit an event to notify parent about the update
    emit('update:insurer', { ...props.insurer, ...updateData });

    // Emit an event to notify parent about the update
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
    // Update local settlement history with fetched data
    localSettlementHistory.value = settlements || [];
    console.log('Fetched settlements:', settlements);
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
    console.log('Settlement history updated from store:', newHistory);
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
