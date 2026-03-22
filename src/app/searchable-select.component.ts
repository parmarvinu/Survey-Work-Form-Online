import { Component, ElementRef, HostListener, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative w-full">
      <div 
        class="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
        (click)="toggleOpen()"
        [class.bg-gray-100]="disabled()"
        [class.opacity-60]="disabled()"
      >
        <span class="text-gray-700 truncate" [class.text-gray-400]="!selectedOption()">
          {{ selectedOption()?.label || placeholder() }}
        </span>
        <mat-icon class="text-gray-500">{{ isOpen() ? 'expand_less' : 'expand_more' }}</mat-icon>
      </div>

      @if (isOpen() && !disabled()) {
        <div class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 flex flex-col overflow-hidden">
          <div class="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <div class="relative">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</mat-icon>
              <input 
                type="text" 
                class="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                [placeholder]="searchPlaceholder()"
                [ngModel]="searchTerm()"
                (ngModelChange)="updateSearch($event)"
                (click)="$event.stopPropagation()"
              >
            </div>
          </div>
          <div class="overflow-y-auto flex-1">
            @for (option of filteredOptions(); track option.value) {
              <div 
                class="px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between"
                [class.bg-blue-50]="option.value === value()"
                [class.text-blue-700]="option.value === value()"
                [class.font-medium]="option.value === value()"
                (click)="selectOption(option)"
              >
                {{ option.label }}
                @if (option.value === value()) {
                  <mat-icon class="text-blue-600 text-sm h-4 w-4 leading-4">check</mat-icon>
                }
              </div>
            }
            @if (filteredOptions().length === 0 && (!allowCustom() || !searchTerm())) {
              <div class="px-4 py-3 text-sm text-gray-500 text-center">No results found</div>
            }
            @if (allowCustom() && searchTerm() && !exactMatchFound()) {
              <div 
                class="px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 transition-colors flex items-center text-blue-600 font-medium border-t border-gray-100"
                (click)="selectCustom(searchTerm())"
              >
                <mat-icon class="text-sm h-4 w-4 leading-4 mr-2">add</mat-icon>
                Add "{{ searchTerm() }}"
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class SearchableSelectComponent implements ControlValueAccessor {
  options = input<{label: string, value: any}[]>([]);
  placeholder = input<string>('Select an option');
  searchPlaceholder = input<string>('Search...');
  allowCustom = input<boolean>(false);
  disabled = signal<boolean>(false);

  isOpen = signal<boolean>(false);
  searchTerm = signal<string>('');
  value = signal<any>(null);
  customSelectedOption = signal<{label: string, value: any} | null>(null);

  selectedOption = computed(() => {
    const val = this.value();
    const found = this.options().find(opt => opt.value === val);
    if (found) return found;
    const custom = this.customSelectedOption();
    if (custom && custom.value === val) return custom;
    if (val) return { label: val, value: val };
    return null;
  });

  filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.options();
    return this.options().filter(opt => opt.label.toLowerCase().includes(term));
  });

  exactMatchFound = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.options().some(opt => opt.label.toLowerCase() === term);
  });

  onChange: any = () => {};
  onTouch: any = () => {};

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.searchTerm.set('');
    }
  }

  toggleOpen() {
    if (this.disabled()) return;
    this.isOpen.update(v => !v);
    if (!this.isOpen()) {
      this.searchTerm.set('');
    }
  }

  updateSearch(term: string) {
    this.searchTerm.set(term);
  }

  selectOption(option: {label: string, value: any}) {
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouch();
    this.isOpen.set(false);
    this.searchTerm.set('');
  }

  selectCustom(term: string) {
    const newOption = { label: term, value: term };
    this.customSelectedOption.set(newOption);
    this.value.set(term);
    this.onChange(term);
    this.onTouch();
    this.isOpen.set(false);
    this.searchTerm.set('');
  }

  writeValue(obj: any): void {
    this.value.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    if (isDisabled) {
      this.isOpen.set(false);
    }
  }
}
