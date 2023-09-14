import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationManager, FromConfigPipe } from 'ngx-remote-configuration';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FromConfigPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <div style="text-align: center; width: 100%">
    <h1>Sample for Ngx Remote Configuration</h1>
    <br />
    <p>
      See console for subscribed values. Try to change something in
      <i>my-demo-config.json</i> configuration file.
    </p>
    <br />
    <p>You can also use <b>FromConfigPipe</b> to get configuration value directly in template.</p>
    <br />
    <p>Value from config at key <i>arrayProp.1</i>: {{ 'arrayProp.1' | fromConfig | json }}</p>
  </div>`,
})
export class AppComponent implements OnInit {
  private readonly configManager = inject(ConfigurationManager);

  ngOnInit(): void {
    // You can subscribe to full configuration
    // Note: Configuration is a key-value pair of anything.
    // This approach is not recommended, since you lose type safety.
    this.configManager.configuration$.subscribe(config =>
      console.log('Full configuration:', config)
    );

    // You can subscribe to a specific configuration value
    // This method is generic, so you can type-hint the returned value, so you get type safety.
    // Type can be a primitive value, nested object or even a nested array.
    this.configManager
      .value$<string>('nestedObj.secondProp')
      .subscribe(value => console.log('Configuration value under <nestedObj.secondProp> :', value));

    // You can subscribe to a specific configuration value and bind it to class instance.
    // Same approach as above, but you also provide 2. argument, which is a class,
    // for which instance will be created and bound to.
    this.configManager
      .value$<NestedConfigurationSection>('nestedObj', NestedConfigurationSection)
      .subscribe(value =>
        console.log('Configuration value under <nestedObj>, bound to class instance :', value)
      );
  }
}

class NestedConfigurationSection {
  secondProp!: string;

  public method(): string {
    return 'Instances can also have methods. Nested prop bound here: ' + this.secondProp;
  }
}
