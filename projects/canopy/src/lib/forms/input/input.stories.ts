import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { action } from '@storybook/addon-actions';
import { boolean, number, text, withKnobs, select } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';

import { notes } from './input.notes';
import { LgIconModule, LgIconRegistry } from '../../icon';
import { LgInputModule } from './input.module';
import { LgLabelModule } from '../label/label.module';
import { LgButtonModule } from '../../button/button.module';
import { LgHintModule } from '../hint';
import { iconsArray } from '../../icon/icons.stories';
import type { ButtonVariant } from '../../button';
import { LgSuffixModule } from '../../suffix';
import { LgPrefixModule } from '../../prefix';

const propsGroupId = 'properties';
const buttonPropsGroupId = 'button properties';
const contentGroupId = 'content';

interface KnobsConfig {
  block?: boolean;
  buttonText?: boolean;
  disabled?: boolean;
  hint?: string | null;
  icon?: string;
  iconButton?: boolean;
  label?: string;
  showLabel?: boolean;
  showButton?: boolean;
  showTextPrefix?: boolean;
  showTextSuffix?: boolean;
  size?: number;
  suffix?: string;
}

const createInputStory = (config: KnobsConfig) => ({
  template: `
    <lg-reactive-form
      (formSubmit)="formSubmit($event)"
      (inputChange)="inputChange($event)"
      [block]="block"
      [buttonText]="buttonText"
      [buttonVariant]="buttonVariant"
      [disabled]="disabled"
      [hint]="hint"
      [icon]="icon"
      [iconButton]="iconButton"
      [label]="label"
      [showLabel]="showLabel"
      [prefix]="prefix"
      [size]="size"
      [suffix]="suffix"
      [showButton]="showButton"
      [showTextPrefix]="showTextPrefix"
      [showTextSuffix]="showTextSuffix"
    ></lg-reactive-form>
  `,
  props: {
    block: boolean('block', false, propsGroupId),
    buttonText: text('button text', 'search', contentGroupId),
    buttonVariant: select(
      'button variant',
      ['solid-primary', 'add-on'],
      'solid-primary',
      buttonPropsGroupId,
    ),
    disabled: boolean('disabled', false, propsGroupId),
    formSubmit: action('formSubmit'),
    hint: text(
      'hint',
      config.hint === null ? '' : 'Please enter your name',
      contentGroupId,
    ),
    icon: select(
      'icon',
      iconsArray.map((icon) => icon.name),
      'search',
      contentGroupId,
    ),
    inputChange: action('inputChange'),
    label: text('label', config.label || 'Name', contentGroupId),
    showLabel: boolean('show label', true, propsGroupId),
    prefix: text('prefix', '£', contentGroupId),
    showButton: boolean('show button', config.showButton, contentGroupId),
    iconButton: boolean('icon button', true, contentGroupId),
    showTextPrefix: boolean('show text prefix', config.showTextPrefix, contentGroupId),
    showTextSuffix: boolean('show text suffix', config.showTextSuffix, contentGroupId),
    suffix: text('suffix', '%', contentGroupId),
    size: number('input size', 12, undefined, propsGroupId),
  },
});

@Component({
  selector: 'lg-reactive-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit(form)">
      <lg-input-field [block]="block" [showLabel]="showLabel">
        {{ label }}
        <lg-hint *ngIf="hint">{{ hint }}</lg-hint>
        <span lgPrefix *ngIf="showTextPrefix">{{ prefix }}</span>
        <input lgInput formControlName="name" [size]="size" />
        <button
          lg-button
          lgSuffix
          size="sm"
          [iconButton]="true"
          variant="add-on"
        >
          Close
          <lg-icon name="close"></lg-icon>
        </button>
        <button
          lg-button
          lgSuffix
          size="sm"
          [iconButton]="iconButton"
          [variant]="buttonVariant"
          *ngIf="showButton"
        >
          {{ buttonText }}
          <lg-icon [name]="icon" *ngIf="iconButton"></lg-icon>
        </button>
        <span lgSuffix *ngIf="showTextSuffix">{{ suffix }}</span>
      </lg-input-field>
    </form>
  `,
})
class ReactiveFormComponent {
  @Input()
  set disabled(disabled: boolean) {
    if (disabled === true) {
      this.form.controls.name.disable();
    } else {
      this.form.controls.name.enable();
    }
  }
  get disabled(): boolean {
    return this.form.controls.name.disabled;
  }

  @Input() block: boolean;
  @Input() buttonText: ButtonVariant;
  @Input() buttonVariant: ButtonVariant;
  @Input() hint: string;
  @Input() icon: string;
  @Input() iconButton: boolean;
  @Input() label: string;
  @Input() showLabel: boolean;
  @Input() prefix: string;
  @Input() showButton: boolean;
  @Input() showTextPrefix: boolean;
  @Input() showTextSuffix: boolean;
  @Input() size: number;
  @Input() suffix: string;

  @Output() inputChange: EventEmitter<void> = new EventEmitter();
  @Output() formSubmit: EventEmitter<void> = new EventEmitter();

  icons = iconsArray;
  form: FormGroup;

  constructor(public fb: FormBuilder, private iconRegistry: LgIconRegistry) {
    this.iconRegistry.registerIcons(this.icons);
    this.form = this.fb.group({ name: { value: '', disabled: false } });
    this.form.valueChanges.subscribe((val) => this.inputChange.emit(val));
  }

  onSubmit(event) {
    this.formSubmit.emit(event);
  }
}

export default {
  title: 'Components/Form/Input',
  parameters: {
    decorators: [
      withKnobs,
      moduleMetadata({
        declarations: [ReactiveFormComponent],
        imports: [
          ReactiveFormsModule,
          LgButtonModule,
          LgHintModule,
          LgIconModule,
          LgInputModule,
          LgLabelModule,
          LgPrefixModule,
          LgSuffixModule,
        ],
      }),
    ],
    notes: {
      markdown: notes,
    },
  },
};

export const standard = () => createInputStory({});

export const withButtonSuffix = () =>
  createInputStory({
    showButton: true,
  });

export const withTextSuffix = () =>
  createInputStory({
    showTextSuffix: true,
    label: 'Amount',
    hint: null,
  });

export const withTextPrefix = () =>
  createInputStory({
    showTextPrefix: true,
    label: 'Amount',
    hint: null,
  });

export const withMultipleButtonSuffixes = () =>
  createInputStory({
    showButton: true,
  });
