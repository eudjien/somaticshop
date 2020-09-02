export const BOOTSTRAP_BREAKPOINTS = [
  {
    alias: 'xs',
    suffix: 'Xs',
    mediaQuery: 'screen and (max-width: 575px)',
    overlapping: false,
    priority: 900
  },
  {
    alias: 'sm',
    suffix: 'Sm',
    mediaQuery: 'screen and (min-width: 576px) and (max-width: 767px)',
    overlapping: false,
    priority: 900
  },
  {
    alias: 'md',
    suffix: 'Md',
    mediaQuery: 'screen and (min-width: 768px) and (max-width: 991px)',
    overlapping: false,
    priority: 800
  },
  {
    alias: 'lg',
    suffix: 'Lg',
    mediaQuery: 'screen and (min-width: 992px) and (max-width: 1199px)',
    overlapping: false,
    priority: 700
  },
  {
    alias: 'xl',
    suffix: 'Xl',
    mediaQuery: 'screen and (min-width: 1200px) and (max-width: 4280px)',
    overlapping: false,
    priority: 600
  },
  {
    alias: 'lt-sm',
    suffix: 'LtSm',
    mediaQuery: 'screen and (max-width: 575px)',
    overlapping: false,
    priority: 950
  },
  {
    alias: 'lt-md',
    suffix: 'LtMd',
    mediaQuery: 'screen and (max-width: 767px)',
    overlapping: false,
    priority: 850
  },
  {
    alias: 'lt-lg',
    suffix: 'LtLg',
    mediaQuery: 'screen and (max-width: 991px)',
    overlapping: false,
    priority: 750
  },
  {
    alias: 'lt-xl',
    suffix: 'LtXl',
    mediaQuery: 'screen and (max-width: 1199px)',
    overlapping: false,
    priority: 650
  },
  {
    alias: 'gt-xs',
    suffix: 'GtXs',
    mediaQuery: 'screen and (min-width: 576px)',
    overlapping: false,
    priority: -950
  },
  {
    alias: 'gt-sm',
    suffix: 'GtSm',
    mediaQuery: 'screen and (min-width: 768px)',
    overlapping: false,
    priority: -850
  },
  {
    alias: 'gt-md',
    suffix: 'GtMd',
    mediaQuery: 'screen and (min-width: 992px)',
    overlapping: false,
    priority: -750
  },
  {
    alias: 'gt-lg',
    suffix: 'GtLg',
    mediaQuery: 'screen and (min-width: 1200px)',
    overlapping: false,
    priority: -650
  }
];


// export const BsFlexLayoutModule = FlexLayoutModule.withConfig({disableDefaultBps: true});
// BsFlexLayoutModule.providers.push(BootstrapBreakPointsProvider);
