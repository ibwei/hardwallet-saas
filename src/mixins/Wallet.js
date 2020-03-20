export default {
  computed: {
    c_xpub: vm => vm.$store.__s('xpub'),
    c_cashUnitItems: vm => vm.$store.__s('cashUnitItems'),
    c_cashUnitIndex: vm => vm.$store.__s('cashUnitIndex'),
    c_coinInfo: vm => vm.$store.__s('coinInfo')
  }
}
