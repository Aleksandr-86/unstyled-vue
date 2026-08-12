import { expect, test } from '@playwright/experimental-ct-vue'

import BaseCheckbox from '@/components/base-checkbox/BaseCheckbox.vue'
import type { BaseCheckboxProps, CheckboxItem } from '@/index.ts'

import FocusScenario from './FocusScenario.vue'
import GroupScenario from './GroupScenario.vue'

declare global {
  interface Window {
    handleNativeEvent: (evt: Event) => void
  }
}

type SingleModelCase = {
  title: string
  props: Partial<BaseCheckboxProps<CheckboxItem>> & { modelValue?: CheckboxItem | CheckboxItem[] }
}

type GroupModelCase = {
  title: string
  props: {
    modelValue: CheckboxItem[]
    values: [CheckboxItem, CheckboxItem]
  }
  expected: [boolean, boolean]
}

type SingleEventCase = {
  title: string
  props: Partial<BaseCheckboxProps<CheckboxItem>> & { modelValue?: CheckboxItem | CheckboxItem[] }
  expected: CheckboxItem[]
}

const SINGLE_UNCHECKED_MODEL_CASES: ReadonlyArray<SingleModelCase> = [
  { title: 'modelValue: undefined', props: { modelValue: undefined } },
  { title: 'modelValue: false', props: { modelValue: false } },
  {
    title: 'modelValue: true, falseValue: true, trueValue: false',
    props: { modelValue: true, falseValue: true, trueValue: false },
  },
  {
    title: "modelValue: 'off', falseValue: 'off', trueValue: 'on'",
    props: { modelValue: 'off', falseValue: 'off', trueValue: 'on' },
  },
  {
    title:
      "modelValue: { id: 3, name: 'apple' }, falseValue: { id: 3, name: 'apple' }, trueValue: { id: 2, name: 'lemon' }",
    props: {
      modelValue: { id: 3, name: 'apple' },
      falseValue: { id: 3, name: 'apple' },
      trueValue: { id: 2, name: 'lemon' },
    },
  },
]

const SINGLE_CHECKED_MODEL_CASES: ReadonlyArray<SingleModelCase> = [
  { title: 'modelValue: true', props: { modelValue: true } },
  {
    title: 'modelValue: false, falseValue: true, trueValue: false',
    props: { modelValue: false, falseValue: true, trueValue: false },
  },
  {
    title: "modelValue: 'on', falseValue: 'off', trueValue: 'on'",
    props: { modelValue: 'on', falseValue: 'off', trueValue: 'on' },
  },
  {
    title:
      "modelValue: { id: 2, name: 'lemon' }, falseValue: { id: 3, name: 'apple' }, trueValue: { id: 2, name: 'lemon' }",
    props: {
      modelValue: { id: 2, name: 'lemon' },
      falseValue: { id: 3, name: 'apple' },
      trueValue: { id: 2, name: 'lemon' },
    },
  },
]

const GROUP_MODEL_CASES: ReadonlyArray<GroupModelCase> = [
  {
    title: "modelValue: [], values: [null, 'apple']",
    props: { modelValue: [], values: [null, 'apple'] },
    expected: [false, false],
  },
  {
    title: "modelValue: [null], values: [null, 'apple']",
    props: { modelValue: [null], values: [null, 'apple'] },
    expected: [true, false],
  },
  {
    title: "modelValue: ['apple'], values: [null, 'apple']",
    props: { modelValue: ['apple'], values: [null, 'apple'] },
    expected: [false, true],
  },
  {
    title: "modelValue: [null, 'apple'], values: [null, 'apple']",
    props: { modelValue: [null, 'apple'], values: [null, 'apple'] },
    expected: [true, true],
  },
  {
    title: "modelValue: ['apple', null], values: [null, 'apple']",
    props: { modelValue: ['apple', null], values: [null, 'apple'] },
    expected: [true, true],
  },
  {
    title: "modelValue: [], values: ['lemon', 'apple']",
    props: { modelValue: [], values: ['lemon', 'apple'] },
    expected: [false, false],
  },
  {
    title: "modelValue: ['lemon'], values: ['lemon', 'apple']",
    props: { modelValue: ['lemon'], values: ['lemon', 'apple'] },
    expected: [true, false],
  },
  {
    title: "modelValue: ['apple'], values: ['lemon', 'apple']",
    props: { modelValue: ['apple'], values: ['lemon', 'apple'] },
    expected: [false, true],
  },
  {
    title: "modelValue: ['lemon', 'apple'], values: ['lemon', 'apple']",
    props: { modelValue: ['lemon', 'apple'], values: ['lemon', 'apple'] },
    expected: [true, true],
  },
  {
    title: "modelValue: ['apple', 'lemon'], values: ['lemon', 'apple']",
    props: { modelValue: ['apple', 'lemon'], values: ['lemon', 'apple'] },
    expected: [true, true],
  },
  {
    title: 'modelValue: [], values: [2, 3]',
    props: { modelValue: [], values: [2, 3] },
    expected: [false, false],
  },
  {
    title: 'modelValue: [2], values: [2, 3]',
    props: { modelValue: [2], values: [2, 3] },
    expected: [true, false],
  },
  {
    title: 'modelValue: [3], values: [2, 3]',
    props: { modelValue: [3], values: [2, 3] },
    expected: [false, true],
  },
  {
    title: 'modelValue: [2, 3], values: [2, 3]',
    props: { modelValue: [2, 3], values: [2, 3] },
    expected: [true, true],
  },
  {
    title: 'modelValue: [3, 2], values: [2, 3]',
    props: { modelValue: [3, 2], values: [2, 3] },
    expected: [true, true],
  },
  {
    title: 'modelValue: [], values: [false, true]',
    props: { modelValue: [], values: [false, true] },
    expected: [false, false],
  },
  {
    title: 'modelValue: [true], values: [false, true]',
    props: { modelValue: [true], values: [false, true] },
    expected: [false, true],
  },
  {
    title: 'modelValue: [false], values: [false, true]',
    props: { modelValue: [false], values: [false, true] },
    expected: [true, false],
  },
  {
    title: 'modelValue: [false, true], values: [false, true]',
    props: { modelValue: [false, true], values: [false, true] },
    expected: [true, true],
  },
  {
    title: 'modelValue: [true, false], values: [false, true]',
    props: { modelValue: [true, false], values: [false, true] },
    expected: [true, true],
  },
  {
    title: "modelValue: [], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]",
    props: {
      modelValue: [],
      values: [
        { id: 2, name: 'lemon' },
        { id: 3, name: 'apple' },
      ],
    },
    expected: [false, false],
  },
  {
    title: "modelValue: [{ id: 2, name: 'lemon' }], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]",
    props: {
      modelValue: [{ id: 2, name: 'lemon' }],
      values: [
        { id: 2, name: 'lemon' },
        { id: 3, name: 'apple' },
      ],
    },
    expected: [true, false],
  },
  {
    title: "modelValue: [{ id: 3, name: 'apple' }], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]",
    props: {
      modelValue: [{ id: 3, name: 'apple' }],
      values: [
        { id: 2, name: 'lemon' },
        { id: 3, name: 'apple' },
      ],
    },
    expected: [false, true],
  },
  {
    title:
      "modelValue: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]",
    props: {
      modelValue: [
        { id: 2, name: 'lemon' },
        { id: 3, name: 'apple' },
      ],
      values: [
        { id: 2, name: 'lemon' },
        { id: 3, name: 'apple' },
      ],
    },
    expected: [true, true],
  },
  {
    title:
      "modelValue: [{ id: 3, name: 'apple' }, { id: 2, name: 'lemon' }], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]",
    props: {
      modelValue: [
        { id: 3, name: 'apple' },
        { id: 2, name: 'lemon' },
      ],
      values: [
        { id: 2, name: 'lemon' },
        { id: 3, name: 'apple' },
      ],
    },
    expected: [true, true],
  },
  {
    title: "modelValue: [{ id: 5, name: 'wrong' }], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]",
    props: {
      modelValue: [{ id: 5, name: 'wrong' }],
      values: [
        { id: 2, name: 'lemon' },
        { id: 3, name: 'apple' },
      ],
    },
    expected: [false, false],
  },
  {
    title:
      "modelValue: [{ id: 5, name: 'wrong' }, { id: 7, name: 'data' }], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]",
    props: {
      modelValue: [
        { id: 5, name: 'wrong' },
        { id: 7, name: 'data' },
      ],
      values: [
        { id: 2, name: 'lemon' },
        { id: 3, name: 'apple' },
      ],
    },
    expected: [false, false],
  },
]

const SINGLE_UNCHECKED_EVENT_CASES: ReadonlyArray<SingleEventCase> = [
  {
    title: 'modelValue: undefined => true, генерируется 1 раз',
    props: { modelValue: undefined },
    expected: [true],
  },
  {
    title: 'modelValue: undefined, readonly: true => не генерируется',
    props: { modelValue: undefined, readonly: true },
    expected: [],
  },
  {
    title: 'modelValue: true, falseValue: true, trueValue: false => false, генерируется 1 раз',
    props: { modelValue: true, falseValue: true, trueValue: false },
    expected: [false],
  },
  {
    title: "modelValue: 'off', falseValue: 'off', trueValue: 'on' => 'on', генерируется 1 раз",
    props: { modelValue: 'off', falseValue: 'off', trueValue: 'on' },
    expected: ['on'],
  },
  {
    title:
      "modelValue: { id: 3, name: 'apple' }, falseValue: { id: 3, name: 'apple' }, trueValue: { id: 2, name: 'lemon' } => { id: 2, name: 'lemon' }, генерируется 1 раз",
    props: {
      modelValue: { id: 3, name: 'apple' },
      falseValue: { id: 3, name: 'apple' },
      trueValue: { id: 2, name: 'lemon' },
    },
    expected: [{ id: 2, name: 'lemon' }],
  },
]

const SINGLE_CHECKED_EVENT_CASES: ReadonlyArray<SingleEventCase> = [
  {
    title: 'modelValue: true => false, генерируется 1 раз',
    props: { modelValue: true },
    expected: [false],
  },
  {
    title: 'modelValue: true, readonly: true => не генерируется',
    props: { modelValue: true, readonly: true },
    expected: [],
  },
  {
    title: 'modelValue: false, falseValue: true, trueValue: false => true, генерируется 1 раз',
    props: { modelValue: false, falseValue: true, trueValue: false },
    expected: [true],
  },
  {
    title: "modelValue: 'on', falseValue: 'off', trueValue: 'on' => 'off', генерируется 1 раз",
    props: { modelValue: 'on', falseValue: 'off', trueValue: 'on' },
    expected: ['off'],
  },
  {
    title:
      "modelValue: { id: 2, name: 'lemon' }, falseValue: { id: 3, name: 'apple' }, trueValue: { id: 2, name: 'lemon' } => { id: 3, name: 'apple' }, генерируется 1 раз",
    props: {
      modelValue: { id: 2, name: 'lemon' },
      falseValue: { id: 3, name: 'apple' },
      trueValue: { id: 2, name: 'lemon' },
    },
    expected: [{ id: 3, name: 'apple' }],
  },
]

test.describe('Базовая отрисовка', () => {
  test('отрисовывает заданный текст метки', async ({ mount }) => {
    const component = await mount(BaseCheckbox, {
      props: { label: 'Согласен с условиями' },
    })

    await expect(component).toContainText('Согласен с условиями')
  })

  test('применяет пользовательские классы параметра classes', async ({ mount }) => {
    const component = await mount(BaseCheckbox, {
      props: {
        label: 'Тест классов',
        classes: {
          root: 'custom-root',
          input: 'custom-input',
          label: 'custom-label',
        },
      },
    })

    await expect(component).toHaveClass(/^custom-root/)
    await expect(component.getByRole('checkbox')).toHaveClass(/^custom-input/)
    await expect(component.locator('span')).toHaveClass(/^custom-label/)
  })

  test('применяет атрибуты к элементу input', async ({ mount }) => {
    const component = await mount(BaseCheckbox)
    const checkbox = component.getByRole('checkbox')

    await expect(checkbox).not.toHaveAttribute('aria-describedby')
    await expect(checkbox).not.toHaveAttribute('aria-invalid')
    await expect(checkbox).not.toHaveAttribute('aria-label')
    await expect(checkbox).not.toBeDisabled()
    await expect(checkbox).not.toHaveAttribute('name')
    await expect(checkbox).not.toHaveAttribute('aria-readonly', 'true')
    await expect(checkbox).not.toHaveAttribute('required')
    await expect(checkbox).not.toHaveAttribute('value')

    await component.update({
      props: {
        ariaDescribedby: 'accept_hint',
        ariaInvalid: true,
        ariaLabel: 'Согласие с условием оферты',
        disabled: true,
        name: 'accept_terms',
        readonly: true,
        required: true,
        value: 'accepted',
      },
    })

    await expect(checkbox).toHaveAttribute('aria-describedby', 'accept_hint')
    await expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    await expect(checkbox).toHaveAttribute('aria-label', 'Согласие с условием оферты')
    await expect(checkbox).toBeDisabled()
    await expect(checkbox).toHaveAttribute('name', 'accept_terms')
    await expect(checkbox).toHaveAttribute('aria-readonly', 'true')
    await expect(checkbox).toHaveAttribute('required')
    await expect(checkbox).toHaveAttribute('value')
  })
})

test.describe('Фокус и доступность', () => {
  test('Получает фокус при нажатии ЛКМ на метку поля в обычном состоянии', async ({ mount }) => {
    const component = await mount(BaseCheckbox, { props: { label: 'Согласен с условием' } })
    const checkbox = component.getByRole('checkbox')

    await component.getByText('Согласен с условием').click()
    await expect(checkbox).toBeFocused()
  })

  test('Не получает фокус при нажатии ЛКМ на метку поля в состоянии disabled', async ({ mount }) => {
    const component = await mount(BaseCheckbox, { props: { label: 'Согласен с условием', disabled: true } })
    const checkbox = component.getByRole('checkbox')

    await component.getByText('Согласен с условием').click({ force: true })
    await expect(checkbox).not.toBeFocused()
  })

  test('Получает фокус при нажатии ЛКМ на метку поля в состоянии readonly', async ({ mount }) => {
    const component = await mount(BaseCheckbox, { props: { label: 'Согласен с условием', readonly: true } })
    const checkbox = component.getByRole('checkbox')

    await component.getByText('Согласен с условием').click()
    await expect(checkbox).toBeFocused()
  })

  test('Получает фокус при нажатии на поле в обычном состоянии', async ({ mount }) => {
    const component = await mount(BaseCheckbox, { props: { label: 'Согласен с условием' } })
    const checkbox = component.getByRole('checkbox')

    await checkbox.click()
    await expect(checkbox).toBeFocused()
  })

  test('Не получает фокус при нажатии на поле в состоянии disabled', async ({ mount }) => {
    const component = await mount(BaseCheckbox, { props: { label: 'Согласен с условием', disabled: true } })
    const checkbox = component.getByRole('checkbox')

    await checkbox.click({ force: true })
    await expect(checkbox).not.toBeFocused()
  })

  test('Получает фокус при нажатии на поле в состоянии readonly', async ({ mount }) => {
    const component = await mount(BaseCheckbox, { props: { label: 'Согласен с условием', readonly: true } })
    const checkbox = component.getByRole('checkbox')

    await checkbox.click()
    await expect(checkbox).toBeFocused()
  })

  test('Переключение фокуса клавишей Tab в обычном состоянии', async ({ mount, page }) => {
    const component = await mount(FocusScenario)
    const checkbox = component.getByRole('checkbox')

    await page.keyboard.press('Tab')
    await expect(component.getByTestId('first')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(checkbox).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(checkbox).not.toBeFocused()
    await expect(component.getByTestId('last')).toBeFocused()
  })

  test('Переключение фокуса клавишей Tab в состоянии disabled', async ({ mount, page }) => {
    const component = await mount(FocusScenario, { props: { disabled: true } })

    await page.keyboard.press('Tab')
    await expect(component.getByTestId('first')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(component.getByRole('checkbox')).not.toBeFocused()
    await expect(component.getByTestId('last')).toBeFocused()
  })

  test('Переключение фокуса клавишей Tab в состоянии readonly', async ({ mount, page }) => {
    const component = await mount(FocusScenario, { props: { readonly: true } })
    const checkbox = component.getByRole('checkbox')

    await page.keyboard.press('Tab')
    await expect(component.getByTestId('first')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(checkbox).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(component.getByRole('checkbox')).not.toBeFocused()
    await expect(component.getByTestId('last')).toBeFocused()
  })
})

test.describe('Слоты', () => {
  test('Отрисовывает содержимое слота по умолчанию вместо текста параметра label', async ({ mount }) => {
    const component = await mount(BaseCheckbox, {
      props: { label: 'Текст метки' },
      slots: { default: 'Текст слота по умолчанию' },
    })

    await expect(component).not.toContainText('Текст метки')
    await expect(component).toContainText('Текст слота по умолчанию')
  })

  test('Отрисовывает содержимое именованного слота control', async ({ mount }) => {
    const component = await mount(BaseCheckbox, {
      slots: { control: '<div class="custom-indicator"></div>' },
    })

    await expect(component.locator('.custom-indicator')).toBeAttached()
  })
})

test.describe('Отображение значения модели при одиночном использовании', () => {
  test.describe('Поле не отмечено', () => {
    for (const { props, title } of SINGLE_UNCHECKED_MODEL_CASES) {
      test(title, async ({ mount }) => {
        const component = await mount(BaseCheckbox, { props })
        await expect(component.getByRole('checkbox')).not.toBeChecked()
      })
    }
  })

  test.describe('Поле отмечено', () => {
    for (const { props, title } of SINGLE_CHECKED_MODEL_CASES) {
      test(title, async ({ mount }) => {
        const component = await mount(BaseCheckbox, { props })
        await expect(component.getByRole('checkbox')).toBeChecked()
      })
    }
  })
})

test.describe.only('Отображение значения модели при групповом использовании', () => {
  for (const { expected, props, title } of GROUP_MODEL_CASES) {
    test(title, async ({ mount }) => {
      const component = await mount(GroupScenario, { props })

      const firstInput = component.locator('input.first')
      const lastInput = component.locator('input.last')

      const [isFirstChecked, isLastChecked] = expected

      if (isFirstChecked) {
        await expect(firstInput).toBeChecked()
      } else {
        await expect(firstInput).not.toBeChecked()
      }

      if (isLastChecked) {
        await expect(lastInput).toBeChecked()
      } else {
        await expect(lastInput).not.toBeChecked()
      }
    })
  }
})

test.describe('Генерация событий при одиночном использовании', () => {
  test.describe('Событие keydown при нажатии клавиши Space', () => {
    test('В обычном состоянии => генерируется 1 раз', async ({ mount, page }) => {
      const emittedEvents: KeyboardEvent[] = []

      await page.exposeFunction('handleNativeEvent', (evt: KeyboardEvent) => {
        emittedEvents.push(evt)
      })

      const component = await mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Согласен с условием' },
      })

      await component.evaluate((el) => {
        el.addEventListener('keydown', (evt) => window.handleNativeEvent(evt))
      })
      const checkbox = component.getByRole('checkbox')

      await checkbox.focus()
      await checkbox.press('Space')

      expect(emittedEvents).toEqual([expect.any(Object)])
    })

    test('В состоянии readonly => не генерируется', async ({ mount, page }) => {
      const emittedEvents: KeyboardEvent[] = []

      await page.exposeFunction('handleNativeEvent', (evt: KeyboardEvent) => {
        emittedEvents.push(evt)
      })

      const component = await mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Согласен с условием', readonly: true },
      })

      await component.evaluate((el) => {
        el.addEventListener('keydown', (evt) => window.handleNativeEvent(evt))
      })
      const checkbox = component.getByRole('checkbox')

      await checkbox.focus()
      await checkbox.press('Space')

      expect(emittedEvents).toEqual([])
    })
  })

  test.describe('Событие click при нажатии ЛКМ на метку поля', () => {
    test('В обычном состоянии => генерируется 1 раз', async ({ mount }) => {
      const emittedEvents: PointerEvent[] = []

      const component = await mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Согласен с условием' },
        on: { click: (value: PointerEvent) => emittedEvents.push(value) },
      })

      await component.getByText('Согласен с условием').click()
      expect(emittedEvents).toEqual([expect.any(Object)])
    })

    test('В состоянии readonly => не генерируется', async ({ mount }) => {
      const emittedEvents: PointerEvent[] = []

      const component = await mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Согласен с условием', readonly: true },
        on: { click: (value: PointerEvent) => emittedEvents.push(value) },
      })

      await component.getByText('Согласен с условием').click()
      expect(emittedEvents).toEqual([])
    })
  })

  test.describe('Событие click при нажатии ЛКМ на поле', () => {
    test('В обычном состоянии => генерируется 1 раз', async ({ mount }) => {
      const emittedEvents: PointerEvent[] = []

      const component = await mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Согласен с условием' },
        on: { click: (value: PointerEvent) => emittedEvents.push(value) },
      })

      await component.getByRole('checkbox').click()
      expect(emittedEvents).toEqual([expect.any(Object)])
    })

    test('В состоянии readonly => не генерируется', async ({ mount }) => {
      const emittedEvents: PointerEvent[] = []

      const component = await mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Согласен с условием', readonly: true },
        on: { click: (value: PointerEvent) => emittedEvents.push(value) },
      })

      await component.getByRole('checkbox').click()
      expect(emittedEvents).toEqual([])
    })
  })

  test.describe('Событие update:modelValue при нажатии ЛКМ на метку поля', () => {
    test.describe('Поле не отмечено', () => {
      for (const { expected, props, title } of SINGLE_UNCHECKED_EVENT_CASES) {
        test(title, async ({ mount }) => {
          const emittedEvents: CheckboxItem[] = []

          const component = await mount(BaseCheckbox, {
            props: { ...props, label: 'Согласен с условием' },
            on: { 'update:modelValue': (value: CheckboxItem) => emittedEvents.push(value) },
          })

          await component.getByText('Согласен с условием').click()
          expect(emittedEvents).toEqual(expected)
        })
      }
    })

    test.describe('Поле отмечено', () => {
      for (const { expected, props, title } of SINGLE_CHECKED_EVENT_CASES) {
        test(title, async ({ mount }) => {
          const emittedEvents: CheckboxItem[] = []

          const component = await mount(BaseCheckbox, {
            props: { ...props, label: 'Согласен с условием' },
            on: { 'update:modelValue': (value: CheckboxItem) => emittedEvents.push(value) },
          })

          await component.getByText('Согласен с условием').click()
          expect(emittedEvents).toEqual(expected)
        })
      }
    })
  })

  test.describe('Событие update:modelValue при нажатии ЛКМ на поле', () => {
    test.describe('Поле не отмечено', () => {
      for (const { expected, props, title } of SINGLE_UNCHECKED_EVENT_CASES) {
        test(title, async ({ mount }) => {
          const emittedEvents: CheckboxItem[] = []

          const component = await mount(BaseCheckbox, {
            props: { ...props, label: 'Согласен с условием' },
            on: { 'update:modelValue': (value: CheckboxItem) => emittedEvents.push(value) },
          })

          await component.getByRole('checkbox').click()
          expect(emittedEvents).toEqual(expected)
        })
      }
    })

    test.describe('Поле отмечено', () => {
      for (const { expected, props, title } of SINGLE_CHECKED_EVENT_CASES) {
        test(title, async ({ mount }) => {
          const emittedEvents: CheckboxItem[] = []

          const component = await mount(BaseCheckbox, {
            props: { ...props, label: 'Согласен с условием' },
            on: { 'update:modelValue': (value: CheckboxItem) => emittedEvents.push(value) },
          })

          await component.getByRole('checkbox').click()
          expect(emittedEvents).toEqual(expected)
        })
      }
    })
  })
})
