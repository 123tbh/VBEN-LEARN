// 从这个包中出来的东西类型：Locale & ReadonlyRecordable
declare module 'ant-design-vue/es/locale/*' {
  import { Locale } from 'ant-design-vue/types/locale-provider';
  const locale: Locale & ReadonlyRecordable;
  export default locale as Locale & ReadonlyRecordable;
}

// 从这个包中出来的东西类型：LocaleSpecification & ReadonlyRecordable
declare module 'moment/dist/locale/*' {
  import { LocaleSpecification } from 'moment';
  const locale: LocaleSpecification & ReadonlyRecordable;
  export default locale;
}
